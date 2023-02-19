import axios from 'axios';

const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const REACT_APP_PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;

export const uploadFile = async(formData) => {
    return await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data"
        },
    });
}

export const uploadNFTMetaData = async(image,name,description) => {
   return await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: JSON.stringify({ "url" : image, "name" : name, "description" : description }),
        headers : {
            'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "application/json"
        },
    });
}