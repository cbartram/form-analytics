import React, { Component } from 'react';
import './App.css';
import AnalyticsWidget from './AnalyticsWidget';

//Users Unique ID for demo purposes
const uuid = "462626f95c01fc699f3ab8125506be17";

class App extends Component {

    constructor() {
        super();

        this.state = {
            meat: '',
            veggie: '',
            crust: '',
            prediction: [],
            customPrediction: [],
            error: '',
            success: ''
        }
    }

    //Change Handlers for Select Fields
    handleMeatChange = (e) => this.setState({meat: e.target.value});
    handleVeggieChange = (e) => this.setState({veggie: e.target.value});
    handleCrustChange = (e) => this.setState({crust: e.target.value});

    /**
     * When the component Mounts this function is called
     */
    componentDidMount = () => {
        //Get the Analytics for desired forms when component Mounts
        AnalyticsWidget.registerPickPredictor({
            namespace: "Pizza.createForm",
            elements: ["Meats", "Crust Style"],
            method: "per-subject-frequency"
        }, (body) => {
            typeof body !== 'undefined' &&
            //Set state for our prediction results
            this.setState({prediction: body});
        });

        //Or Do a custom query for this specific user and get his/her results
        AnalyticsWidget.query("Pizza.createForm").table("Crust Style").onlyUser(uuid).exec(res => {
           //The Query's Dataset 
           console.log(res);

            AnalyticsWidget.analyze({
                data: res,
                method: 'per-subject-frequency'
            }, analysis => {
                console.log(analysis);
            })
        });
    };


    /**
     * Handles Submitting the Form
     */
    handleClick = () => {
        const {meat, veggie, crust} = this.state;

        if(meat === '' || veggie === '' || crust === '') {
            this.setState({error: 'You need to select values first!', success: ''});
        } else {

            //Insert data
            AnalyticsWidget.insert({
                namespace: ["Pizza.createForm"],
                elements: ["Meats", "Veggies", "Crust Style"],
                values: [meat, veggie, crust],
                user: uuid
            });

            //Re-run Analytics
            this.setState({success: 'Successfully inserted data and re-ran analytics', error: ''})
        }
    };

    render() {
        return (
            <div className="App">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <span className="label label-danger">{this.state.error}</span>
                        <span className="label label-success">{this.state.success}</span>
                        <div className="form-group">
                            <label>Meats</label>
                            <select onChange={this.handleMeatChange} className="form-control" name="Meat">
                                <option value="Beef">Beef</option>
                                <option value="Ham">Ham</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Anchovies">Anchovies</option>
                                <option value="Bacon">Bacon</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Veggies</label>
                            <select onChange={this.handleVeggieChange} className="form-control" name="Veggies">
                                <option value="Corn">Corn</option>
                                <option value="Peppers">Peppers</option>
                                <option value="Onions">Onions</option>
                                <option value="Tomatoes">Tomatoes</option>
                                <option value="Basil">Basil</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Crust Style</label>
                            <select onChange={this.handleCrustChange} className="form-control" name="Crust Style">
                                <option value="Thin">Thin</option>
                                <option value="Thick">Thick</option>
                                <option value="Cheese">Cheese</option>
                                <option value="Pie">Pie</option>
                            </select>
                        </div>
                        <button type="submit" onClick={this.handleClick} className="btn btn-primary">Submit</button>
                        <h4>Suggestions for you!</h4>
                        <ul>
                            {
                                //Map over prediction results
                                this.state.prediction.map(ele => {
                                    return ele.map(i => {
                                        return <li key={i + Math.random()}>{i}</li>
                                    });
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
