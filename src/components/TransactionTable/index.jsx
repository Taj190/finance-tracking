import React, { useState } from 'react';
import { Table, Radio,Popconfirm, Modal, Form, Input, Select } from 'antd';
import { toast } from 'react-toastify';
import { parse, unparse} from "papaparse";
import './style.css'

function TransactionTable({ transactions, fetchTransactions, deleteTransaction, updateTransaction }) {
  const { Option } = Select;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => handleEdit(record)} className='edit-delete'>Edit</a>
          <Popconfirm
            title="Are you sure you want to delete this transaction?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a style={{ marginLeft: 8 }} className='edit-delete'>Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === '' || item.type === typeFilter)
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.date) - new Date(b.date); // assuming date is a string
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const handleEdit = (transaction) => {
    setEditedTransaction(transaction);
    setIsModalVisible(true);
    form.setFieldsValue(transaction); // Set form values for editing
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      console.log(`Transaction with id ${id} deleted`);
      toast.success('Transaction deleted');
      fetchTransactions(); // Refresh the transactions after deletion
    } catch (error) {
      console.error("Error deleting transaction: ", error);
      toast.error("Couldn't delete transaction");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      // Parse the amount as a float before updating the transaction
      values.amount = parseFloat(values.amount);
      await updateTransaction(editedTransaction.id, values);
      setIsModalVisible(false);
      fetchTransactions(); 
    } catch (error) {
      console.error("Failed to update transaction:", error);
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
        <button className="export-btn btn btn-blue "onClick={exportCSV}>
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
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name of the transaction!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input the amount of the transaction!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="tag"
            label="Tag"
            rules={[{ required: true, message: 'Please input the tag of the transaction!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please input the date of the transaction!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select the type of the transaction!' }]}
          >
            <Select>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TransactionTable;
