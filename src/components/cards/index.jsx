import React from 'react'
import { Button, Card, Row } from 'antd';
import './style.css'
function Cards({showExpenseModal,showIncomeModal , income , expenses, totalBalance}) {
  return (
    <div >
        <Row className='my-row'>
                <Card className='my-card' title="Current Balance"hoverable>
                <h2>Cuurent Balance</h2>
              <p>$ {totalBalance}</p>    
                <Button >Reset Balance</Button>
                </Card>

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