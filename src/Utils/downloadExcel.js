import React from 'react';
import RNFS from 'react-native-fs';  // Import react-native-fs for file system access

const downloadExcel = async (fileUrl, fileName) => {
    try {
        // Define the file path to download the file
        const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        const fileExists = await RNFS.exists( fileUrl);
console.log('File exists:', fileExists);
        // Start the download process
        const options = {
            fromUrl: `file://${fileUrl}`,         // The URL of the file to download
            toFile: downloadDest,     // The destination file path on the device
            background: true,         // Allows the download to happen in the background
            begin: (res) => {
                console.log('Download started', res);
            },
            progress: (res) => {
                let progress = res.bytesWritten / res.contentLength;
                console.log('Download progress: ', Math.floor(progress * 100) + '%');
            }
        };
        
        // Perform the download
        const downloadResult = await RNFS.downloadFile(options).promise;
        
        // Check if the download was successful
        if (downloadResult.statusCode === 200) {
            console.log('Download completed:', downloadDest);
        } else {
            console.log('Download failed, status code:', downloadResult.statusCode);
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

export default downloadExcel;
