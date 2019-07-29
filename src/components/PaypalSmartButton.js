import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';

class PaypalSmartButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };

         window.React = React;
         window.ReactDOM = ReactDOM;

        this.renderSmartButton = this.renderSmartButton.bind(this);
    }

    componentDidMount() {
        const {isScriptLoaded, isScriptLoadSucceed } = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {
            // Component has mounted, OK to work with script in componentWillRecieveProps()
            this.setState({loaded: true});
        }
    }

    componentWillReceiveProps(newProps) {
        const { isScriptLoaded, isScriptLoadSucceed } = newProps;
        this.renderSmartButton(isScriptLoaded, isScriptLoadSucceed);
    }

    renderSmartButton(isScriptLoaded, isScriptLoadSucceed) {
        if (!this.state.loaded && !this.props.isScriptLoaded &&
            isScriptLoaded && isScriptLoadSucceed) {
                this.setState({loaded: true});

                window.paypal.Buttons({

                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: this.props.value,
                                }
                            }],
                            intent: 'CAPTURE',
                            application_context: {
                                return_url: "http://localhost:5000"
                            },
                            currency: this.props.currency,
                            description: this.props.description
                        })
                    },

                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            console.log('Payment Success');
                            console.log(details);
                            const xhr = new XMLHttpRequest();
                            const data = new FormData();
                            data.append('paypalInfo', JSON.stringify(details));
                            data.append('bookingInfo', JSON.stringify(this.props.book));
                            data.append('total', this.props.value + " " + this.props.currency);
                            xhr.onload = () => console.log(xhr.response);
                            xhr.open('POST', "/api/payment-confirmed");
                            xhr.send(data);
                        })
                    },

                    onError: function (err) {
                        console.error(err);
                    },

                    onCancel: function (data) {
                        console.log('Payment Cancelled');
                        console.log('Canceld Data:', data);
                    }
                }).render('#Smart-Payment-Button')
        }

    }


    render() {
        return(
            <div id='Smart-Payment-Button' />
        )
    }

}

let script = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`
console.log("Lazy Loading:", script);
export default scriptLoader(script)(PaypalSmartButton);