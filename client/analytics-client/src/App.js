import React, { Component } from 'react';
import './App.css';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import AnalyticsWidget from 'analytics-api-fb/lib/index';
//import AnalyticsWidget from './AnalyticsAPI';

//Users Unique ID for demo purposes
const uuid = "462626f95c01fc699f3ab8125506be17";

class App extends Component {

    constructor() {
        super();

        this.state = {
            meat: 'Beef',
            veggie: 'Corn',
            crust: 'Thin',
            prediction: [],
            customPrediction: [], //Output of the custom prediction
            neuralPrediction: [], //Output of the Neural Network
            customQueryResponse: null,
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
         AnalyticsWidget.setHost('http://34.237.224.226:3010');

        //Get the Analytics for desired forms when component Mounts
        AnalyticsWidget.registerPickPredictor({
            namespace: "Pizza.createForm",
            elements: ["Meats", "Veggies", "Crust Style"],
            method: "per-subject-frequency",
            limit: 5
        }, (body) => {
            typeof body !== 'undefined' &&
            //Set state for our prediction results
            this.setState({prediction: body, loading: false});
        });

        //Or Do a custom query for this specific user and get his/her results
        AnalyticsWidget.query().database("Pizza.createForm").tables(["Meats", "Crust Style"]).exec(res => {
           //The Query's Dataset
           this.setState({customQueryResponse: res});

            //Running Analytics on the Custom Dataset
            AnalyticsWidget.analyze({
                data: res,
                method: 'per-subject-frequency'
            }, analysis => {
                this.setState({customPrediction: analysis});
            })
        });
    };


    /**
     * Handles Submitting the Form
     */
    handleClick = () => {
        const {meat, veggie, crust} = this.state;

        //Insert data
        AnalyticsWidget.insert({
            namespace: ["Pizza.createForm"],
            elements: ["Meats", "Veggies", "Crust Style"],
            values: [meat, veggie, crust],
            user: uuid
        });

        //Re-run Analytics
        AnalyticsWidget.query().database('Pizza.createForm').onlyUser(uuid).exec(data => {

            const config = {
                data,
                method: 'neural-network'
            };

            //We now have a defined data set to run the analytics on
            AnalyticsWidget.analyze(config, prediction => {
                //If the method type if neural network we want to display these results separately
                if(config.method === 'neural-network') {
                    this.setState({neuralPrediction: prediction[0], success: 'Successfully inserted data and re-ran analytics', error: ''})
                } else {
                    this.setState({prediction, success: 'Successfully inserted data and re-ran analytics', error: ''});
                }
            });
        });
    };

    render() {
        return (
            <div className="App">
                <div className="row">
                    <div className="col-md-3 col-md-offset-1">
                        <h2>Form Analytics Demo</h2>
                        <span className="label label-danger" style={{fontSize:15, marginBottom:15}}>{this.state.error}</span>
                        <span className="label label-success" style={{fontSize:15, marginBottom:15}}>{this.state.success}</span>
                        <div className="form-group">
                            <label>Meats</label>
                            <select onChange={this.handleMeatChange} className="form-control">
                                <option value="Beef">Beef</option>
                                <option value="Ham">Ham</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Anchovies">Anchovies</option>
                                <option value="Bacon">Bacon</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Veggies</label>
                            <select onChange={this.handleVeggieChange} className="form-control">
                                <option value="Corn">Corn</option>
                                <option value="Peppers">Peppers</option>
                                <option value="Onions">Onions</option>
                                <option value="Tomatoes">Tomatoes</option>
                                <option value="Basil">Basil</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Crust Style</label>
                            <select onChange={this.handleCrustChange} className="form-control">
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

                                            //If the method specified was neural-network the predictions come back as nested arrays
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
                        <div className="row">
                            <div className="col-md-12">
                                <h3>Neural Network Predictions</h3>
                                {
                                    this.state.neuralPrediction.length > 0 && this.state.neuralPrediction.map(item => {
                                      return  <Chip style={{margin:4}} backgroundColor={'#58baff'} key={item.name}>
                                                    <Avatar color={'#58baff'} backgroundColor={'#5421FF'} icon={<FontIcon className="fa fa-star"/>} />
                                                    {`${item.name} - ${Math.round(item.confidence * 100)}%`}
                                              </Chip>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h2>Raw Output</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <h3>ComponentDidMount() Prediction</h3>
                                <div className="code-wrapper">
                                    <code>
                                        { JSON.stringify(this.state.prediction, null, 4) }
                                    </code>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h3>Custom Query Prediction</h3>
                                <div className="code-wrapper">
                                    <code>
                                        { JSON.stringify(this.state.customPrediction, null, 4) }
                                    </code>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <h3>Custom Query Response Data</h3>
                                <div className="code-wrapper">
                                    <code className="code-wrapper">
                                        { JSON.stringify(this.state.customQueryResponse, null, "\t") }
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
