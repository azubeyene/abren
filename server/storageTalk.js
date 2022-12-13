// NOTE: this file is incomplete. Eventually I'll add a function to modify an existing
// file, but this is a pretty uncommon application in my experience, so I'll do it later.

const { Storage } = require('@google-cloud/storage');
const NodeCache = require("node-cache");

// The advantage of this cache is that we avoid loading images we've seen recently,
// since GCP will charge you money if you request too much data. See GCP pricing.
// This sets time to live to 2hrs, and to check for expired cache entries every hour.
// If you don't understand this, just take out all the lines that have "cache" in them.
const imageCache = new NodeCache({ stdTTL: 7200, checkperiod: 3600 });

// TODO: replace this projectId with your own GCP project id!
const storageInfo = { projectId: "abren-302116" };
if (process.env.GCP_PRIVATE_KEY && process.env.GCP_CLIENT_EMAIL) {
    storageInfo.credentials = { private_key: process.env.GCP_PRIVATE_KEY, client_email: process.env.GCP_CLIENT_EMAIL };
}
const storage = new Storage(storageInfo);

// TODO: replace this bucket name with your own bucket inside your project
const bucket = storage.bucket('abren');







// This just creates a random file name. If you want to choose your own filenames,
// just make sure they're unique. All the files in a bucket need unique names.
const generateObjectName = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    const length = 12; // could safely store 2^70 objects without slowing runtime
    let ans = ""
    for (let i = 0; i < length; i++) {
        ans += chars[Math.floor(Math.random() * chars.length)];
    }
    return ans;
}

/**
 * 
 * @param {string} image This should be a UTF-8 string. If you're uploading an image,
 *   it should probably look like "data:image/<image encoding>;base64,<other stuff>"
 *   The front end I wrote should do that for you.
 *   If you're uploading a different kind of file, that'll work too, just make sure that
 *   it's in UTF-8 already. See Buffer.from and Buffer.toString for how to convert
 * 
 * @returns {Promise<string>} Returns a promise that will give you the filename used
 *   to access this file. If the promise will be rejected upon any errors.
 */
const uploadImagePromise = (image) => {
    const name = generateObjectName();
    imageCache.set(name, image); // update the cache with this new value

    // WARNING: should validate image here for security, but idk how.
    // I think <img src="malicious data" /> is still safe, but i don't know things.
    return new Promise((resolve, reject) => {
        // generation:0 means there can't exist a previous file or it'll throw an error
        const file = bucket.file(name, { generation: 0 });
        file.createWriteStream()
            .on('error', error => {
                if (error.code == 412) {
                    // the name was taken, so just try again
                    resolve(uploadImagePromise(image));
                } else {
                    // some other error. No point trying again, so error out.
                    reject(error);
                }
            })
            .on('finish', () => {
                // if we succeed, the promise should produce the filename
                resolve(name);
            })
            .end(Buffer.from(image));
    });
}

/**
 * 
 * @param {string} name Download a previously uploaded image with the given file name.
 * 
 * @returns {Promise<string>} Returns a promise to the image, which will be encoded as
 *    a UTF-8 string. In the case of images, you can do <img src={output goes here} />
 *    and it will automatically work. If you're using some other files, you may need
 *    to do some more work. The promise will be rejected if GCP throws an error or the
 *    file does not exist.
 */
const downloadImagePromise = (name) => {
    // data[0] is the file data
    const cachedValue = imageCache.get(name);
    if (typeof (cachedValue) === 'string') {
        // this is a valid cached value. just return that!
        return Promise.resolve(cachedValue);
    } // end of cache stuff

    return bucket.file(name).download().then(data => {
        const image = data[0].toString();
        imageCache.set(name, image); // update cache with downloaded data
        return image;
    });
}


/**
 * 
 * @param {string} name The name of the file to delete
 * 
 * @returns {Promise<boolean>} Returns a promise to a boolean, true if the deletion
 *    was successful. This promise will never be rejected.
 */
const deleteImagePromise = (name) => { // returns true if succeeded
    return bucket.file(name).delete().then(resp => true).catch(err => {
        // 404 means already deleted, so the promise produces true
        // if we get another error, then we failed to delete, so produces false
        return err.code === 404;
    }).then(success => {
        // NOTE: if you decide not to use cache, remove this whole .then
        if (success) {
            // removed from GCP, so remove from cache too!
            imageCache.del(name);
        }
        return success;
    });
}


module.exports = { uploadImagePromise, downloadImagePromise, deleteImagePromise };