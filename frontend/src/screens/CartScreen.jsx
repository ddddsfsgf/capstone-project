import React, {useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { useParams } from 'react-router-dom'
import Message from '../components/Message'



const CartScreen = ({history}) => {
  const {id} = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const productId = id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  

  console.log(location.search);

  const userLogin = useSelector(state => state.userLogin)
  const { error, loading, userInfo } = userLogin

  const cart = useSelector(state => state.cart)
  const {cartItems} = cart

  useEffect(() => {
    if(productId){
      dispatch(addToCart(productId, qty))
    }

  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping')
  }


  return (
    <Row>

      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant='info'>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ): (
          <ListGroup variant='flush'>
            {cartItems.map(item => (
              <ListGroupItem key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    ${item.price}
                  </Col>
                  <Col md={3}>
                  Quantity
                    <Form.Control as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                          {
                            [...Array(item.countInStock).keys()].map((x) => (
                              <option value={x + 1} key={x+1}>
                                {x + 1}
                              </option>
                            ))
                          }
                    </Form.Control>
                  </Col>

                  <Col md={1}>
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                      <i className='delete'>Remove</i>

                    </Button>
                  </Col>
                </Row>

              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h2>
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed()}
            </ListGroupItem>
          </ListGroup>
          
          <ListGroup.Item>
                <Button
                    type='button'
                    className='btn-block'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                >
                    Proceed To Checkout
                </Button>
            </ListGroup.Item>
        </Card>
      </Col>

    </Row>
  )
}

export default CartScreen