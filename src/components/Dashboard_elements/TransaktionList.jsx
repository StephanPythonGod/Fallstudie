import React, {Component} from 'react'
import Transaktion from './Transaktion'
import axios from "axios"
import Button from '@material-ui/core/Button';

class Page extends Component {
    _isMounted = false;
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            transactions : [],
            dates : [],
            user: props.user,
            bankvalue : 0
            }
    }
    
    getDatabaseUpdate(){
        axios.get("https://fallstudie-dhbw.firebaseio.com/transactions.json").then(
        response =>   {
            const fetchedOrders = [];
            for (let key in response.data){
                fetchedOrders.push({
                    ...response.data[key], 
                    id : key
                })
            this.setState({transactions: fetchedOrders})
            }
        
        this.usersTransactions()
        this.getDates()
        this.calculateBankacc()
    })}

    getDates(){
        const unique = [...new Set(this.state.transactions.map(item => item.date))];
        this.setState({dates : unique})
    }

    componentDidMount() {
      this._isMounted = true;
    
      this.getDatabaseUpdate()

    }
  
    componentWillUnmount() {
      this._isMounted = false;
    }

    usersTransactions(){
        const newTrans = [...this.state.transactions]
        const trans = newTrans.filter(trans => trans.user === this.state.user)
        this.setState({transactions: trans})
    }

    splitTransactions(date){
        const newTrans = [...this.state.transactions]
        const trans = newTrans.filter(trans => trans.date === date)
        return trans
    }

    calculateBankacc(){
        this.state.transactions.map(trans =>{
            const x = this.state.bankvalue + trans.value
            this.state.bankvalue = x
        })
    }

    
  
    render() {
        
      return (
        <React.Fragment>
        <div>
        <h1>Kontostand: {this.state.bankvalue}</h1>
        <ul>
            {
            this.state.dates.map(date =>{
                return(
                <React.Fragment>
                    <h3>{date}</h3>
                    <Transaktion transactions = {this.splitTransactions(date)} date={date}></Transaktion>
                </React.Fragment>
                )
        })
        }
        </ul>
        
        </div>           
        </React.Fragment>
        )
    }
  }
  
export default Page;