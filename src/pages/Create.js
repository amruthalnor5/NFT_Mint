import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Row, Form, Button } from 'react-bootstrap';
import { uploadFile, uploadNFTMetaData } from '../services/create.service';

const Create = ({ currentNetwork, nft, account }) => {
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                setImageFile(event.target.files[0]);
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
    }

    const createNFT = async () => {
        if (!name || !description || !imageFile) return
        console.log("createNFT imageFile:", imageFile);
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", imageFile);

            const resFile = await uploadFile(formData);

            const image = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;

            const res = await uploadNFTMetaData(image, name, description);

            const uri = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;

            const result = await nft.methods.mintNow(uri).send({ from: account });

            setLoading(false);

            navigate('/');

            console.log("result:", result);

        } catch (error) {
            console.log("createNFTs error: ", error)
            setLoading(false);
        }
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                            />
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                            <div className="d-grid px-0">
                                <Button disabled={loading} onClick={createNFT} variant="primary" size="lg">
                                    { loading ? 'Please wait...' : 'Create NFT!' }
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Create