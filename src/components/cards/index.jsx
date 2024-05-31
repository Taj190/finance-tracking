import React, { useState } from 'react'
import { Button, Card, Modal, Row } from 'antd';
import './style.css'
function Cards({showExpenseModal,showIncomeModal , income , expenses, totalBalance ,  deleteAllTransaction}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showDeleteConfirm=()=>{
    setIsModalVisible(true);
  }
  const handleOk =() =>{
    deleteAllTransaction()
    setIsModalVisible(false);
  }
  const handleCancel =() =>{
    setIsModalVisible(false);
  }
  return (
    <div >
        <Row className='my-row'>
                <Card className='my-card' title="Current Balance"hoverable>
                <h2>Cuurent Balance</h2>
              <p>$ {totalBalance}</p>    
                <Button onClick={ showDeleteConfirm} >Reset Balance</Button>
                </Card>

      <Modal
        title="Delete Transaction"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to reset the balance?</p>
      </Modal>

                <Card className='my-card' title="Toatal Income"hoverable>
                <h2>Total Income</h2>
                <p>$ {income}</p>   
                <Button onClick={showIncomeModal} >Add Income</Button>
                </Card>

                <Card className='my-card' title="Total Expenses"hoverable>
                <h2>Add Expense</h2>
                <p>$ {expenses} </p>   

                <Button onClick={showExpenseModal} >Add Expenses</Button>
                </Card>
    </Row>
         
   
           
  

    </div>
  )
}

export default Cards