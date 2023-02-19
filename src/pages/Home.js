import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, Form, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function Home({ currentNetwork, nft, account }) {

  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const navigate = useNavigate();

  const loadListedItems = async () => {
    setLoading(true);
    const itemCount = await nft.methods.ids().call();
    let listedItems = [];
    for (let indx = 1; indx <= Number(itemCount); indx++) {
      const owner = await nft.methods.ownerOf(indx).call();
        const uri = await nft.methods.tokenURI(indx).call();

        const response = await fetch(uri);
        const metadata = await response.json();

        let item = {
          itemId: indx,
          name: metadata.name,
          description: metadata.description,
          image: metadata.url,
          owner: owner
        }
        listedItems.push(item)
    }
    console.log("listedItems:", listedItems);
    setLoading(false);
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }

  const makeToSell = async (item) => { 

  }

  useEffect(() => {
    loadListedItems();
  }, []);
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <>
      <div className="flex justify-center mt-2">
      <Container>
              <Row className='flex justify-center' >
                <Col lg={8} md={8} sm={8} />
                <Col lg={3} md={3} sm={3} >
                  <Button onClick={()=>navigate('/create')} variant="outline-danger" size="lg">
                    Create New
                  </Button>
                </Col>
              </Row>
            </Container>
        {listedItems.length > 0 ?
          <div className="px-5 py-3 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {listedItems.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Header><b>#{item.itemId}</b></Card.Header>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body>
                      <Card.Title>{item?.name}</Card.Title>
                      <Card.Text>
                        {item?.description}
                        <br />
                        <span><b>Owner:</b> {item?.owner.slice(0, 5) + '...' + item?.owner.slice(38, 42)}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h4>No Created assets</h4>
            </main>
          )}
      </div>
    </>
  );
}