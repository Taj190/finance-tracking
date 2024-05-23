import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/cards';
import { Modal } from 'antd';
import AddIncomeModal from '../components/Modals/Addincome';
import AddExpenseModal from '../components/Modals/Addexpenses';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from "moment";
import TransactionTable from '../components/TransactionTable';
import ChartComponent from '../components/chart';
import NoTransactions from '../components/Notransaction';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income , setIncome] = useState(0);
  const [expenses , setExpenses] = useState(0);
  const [totalBalance , setCurrentBalance] = useState(0);
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction ) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction)
      setTransactions(newArr);
      calculateBalance()
      
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
      
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        const transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        console.log(transactionsArray);
        toast.success("Transactions Fetched!");
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        toast.error("Couldn't fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance() 
  }, [transactions])
   
  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  }
  let sortedTransactions = transactions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
})
  return (
    <div>
      <Header />
      {loading ? (
        <p>loading..</p>
      ) : (
        <>
          <Cards showExpenseModal={showExpenseModal} showIncomeModal={showIncomeModal}
          income={income} expenses= {expenses} totalBalance={totalBalance} />
          
          {transactions.length > 0  ? <ChartComponent sortedTransactions={sortedTransactions}/> :<NoTransactions/>}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} addTransaction={addTransaction}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
 