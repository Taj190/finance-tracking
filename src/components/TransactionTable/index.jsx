import React, { useState } from 'react'
import './style.css'
import { Input, Radio, Select, Table, Popconfirm, Modal, Form, InputNumber } from 'antd';
import { parse, unparse} from "papaparse";
import { toast } from 'react-toastify';

function TransactionTable({transactions , addTransaction , fetchTransactions,deleteTransaction}) {
    const {Option} = Select
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const[sortKey, setSortKey] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editedTransaction, setEditedTransaction] = useState(null);
    const [form] = Form.useForm();
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },

          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={() => handleEdit(record)}>Edit</a>
                <Popconfirm
                  title="Are you sure delete this transaction?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <a style={{ marginLeft: 8 }}>Delete</a>
                </Popconfirm>
              </span>
            ),
          },
      ];
      
      
      let filteredTransactions = transactions.filter((item) =>
        item.name && item.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === '' || item.type === typeFilter)
    );
    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === 'date') {
            return new Date(a.date) - new Date(b.date); 
        } else if (sortKey === 'amount') {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });
    
  const handleEdit = (transaction) => {
    setEditedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    console.log(`Transaction with id ${id} deleted`);
    toast.success('Transaction deleted');
    
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedTransaction = {
       ...editedTransaction,
       ...values,
        amount: parseFloat(values.amount),
      };
      await addTransaction(updatedTransaction, true);
      toast.success('Transaction updated');
      setIsModalVisible(false);
      setEditedTransaction(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };
     function exportCSV(){
        var csv = unparse ({
            fields: ["name", "type" , "tag" ,"amount" , "date"],
          data:  transactions,
              
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
     }
     function importFromCsv(event) {
        event.preventDefault();
        try {
          parse(event.target.files[0], {
            header: true,
            complete: async function (results) {
              // Now results.data is an array of objects representing your CSV rows
              for (const transaction of results.data) {
             
                console.log("Transactions", transaction);
                const newTransaction = {
                  ...transaction,
                  amount: parseFloat(transaction.amount),
                };
                await addTransaction(newTransaction, true);
              }
            },
          });
          toast.success("All Transactions Added");
          fetchTransactions();
          event.target.files = null;
        } catch (e) {
          toast.error(e.message);
        }
      }

  return (
    <>
    <h1 className='table-title'>Search by Name</h1>
    <Input  value={search} className='table-input' placeholder='Search By Name'
    onChange={(e) => {setSearch(e.target.value)}} />
    
    <div className='radio-select-btn'>
    <div className='select-input'>
    <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
    </div>

        <div className='radio-btn'>
        <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
        </div>
        <div className='export-import-btn'
           style={{display: 'flex',}}
          >
        <button className="export-btn btn btn-blue"onClick={exportCSV}>
              Export to CSV
            </button>
            <label for="file-csv"className="export-btn btn btn-blue" >
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onClick={importFromCsv}
              style={{ display: "none" }}
            />
          </div>
    </div>
    <Table dataSource={sortedTransactions} columns={columns} />
    <Modal
        title="Edit Transaction"
        oprn={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} initialValues={editedTransaction}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Tag" name="tag">
            <Input />
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
   
    </>
  )
}

export default TransactionTable