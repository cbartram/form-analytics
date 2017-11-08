import React, { Component } from 'react';
import './App.css';
import CircularProgress from 'material-ui/CircularProgress';
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
            success: '',
            loading: true
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
            elements: ["Meats", "Veggies", "Crust Style"],
            method: "per-subject-frequency",
            limit: 3
        }, (body) => {
            typeof body !== 'undefined' &&
            //Set state for our prediction results
            this.setState({prediction: body, loading: false});
            console.log("ComponentDidMount Prediction", body)
        });

        //Or Do a custom query for this specific user and get his/her results
        AnalyticsWidget.query().database("Pizza.createForm").exec(res => {
           //The Query's Dataset 
           console.log("Custom Query Response", res);

            AnalyticsWidget.analyze({
                data: res,
                method: 'per-subject-frequency'
            }, analysis => {
                console.log("Analysis of Custom Query", analysis);
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
            AnalyticsWidget.query().database('Pizza.createForm').onlyUser(uuid).exec(data => {
               //We now have a defined data set to run the analytics on
                AnalyticsWidget.analyze({
                    data,
                    method: 'per-subject-frequency'
                }, prediction => {
                    console.log(prediction);
                  // this.setState({prediction});
                });
            });


            this.setState({success: 'Successfully inserted data and re-ran analytics', error: ''})
        }
    };

    render() {
        return (
            <div className="App">
                <div className="row">
                    <div className="col-md-3 col-md-offset-5">
                        <h2>Form Analytics Demo</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-md-offset-5">
                        <span className="label label-danger" style={{fontSize:15, marginBottom:15}}>{this.state.error}</span>
                        <span className="label label-success" style={{fontSize:15, marginBottom:15}}>{this.state.success}</span>
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

                        {
                         this.state.loading ? <div>
                             <h4>Loading Suggestions!</h4>
                             <CircularProgress size={80} thickness={5} />
                         </div> :
                             <div className="row">
                                 <h4>Suggestions for you!</h4>
                                 {
                                     this.state.prediction.map((arr, key) => {
                                         return (
                                             <div className="col-md-4" key={key}>
                                                 <ul className="list-group">
                                                     {
                                                         arr.map((prediction, key) => {
                                                             return <li className="list-group-item" key={key}>{prediction}</li>
                                                         })
                                                     }
                                                 </ul>
                                             </div>
                                         )
                                     })
                                 }
                             </div>
                        }


                    </div>
                </div>
            </div>
        );
    }
}

export default App;
