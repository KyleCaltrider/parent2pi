import React from 'react';
import Select from 'react-select';

import PaypalSmartButton from './PaypalSmartButton';

function selectize(value) {
    return {'value': value, 'label': value};
}

function Book(props) {
    let {bookingDate, bookingEmail, bookingName, bookingParticipants,
        bookingType, bookingComments, bookingDiscount, bookingDiscountPercent} = props.book;
    let total = bookingParticipants.slice(0, 1).toLowerCase() === "i" ?
                    props.renderElement("Book", "individual_price", "") : bookingParticipants.slice(0, 1).toLowerCase() === "c" ?
                            props.renderElement("Book", "couples_price", "") : "";
        if (bookingDiscount !== 1 && total) {
            total = parseFloat(total) * bookingDiscountPercent;
            total = total.toFixed(2);
        }

    console.log(`Total = ${total}`);
    let currency = props.renderElement("Book", "currency", "USD");
    if (bookingDate) bookingDate = selectize(bookingDate);
    if (bookingParticipants) bookingParticipants = selectize(bookingParticipants);
    if (bookingType) bookingType = selectize(bookingType);

    const typeOptions = [
        selectize(props.renderElement("Book", "class_1")),
        selectize(props.renderElement("Book", "class_2"))
    ];
    const participantsOptions = [
        selectize("Individual"),
        selectize("Couple")
    ];
    let classDates = bookingType === props.renderElement("Book", "class_1") ? "class_1_dates" : "class_2_dates",
        dates = props.renderElement("Book", classDates).split(/[\r\n]+/).map(d => selectize(d));
    return(
        <div id="Book">
                <div id="Book-form" >
                    <input type="text" placeholder="Full Name"
                        className="bookingName text-input form-input"
                        name="bookingName" value={bookingName}
                        onChange={props.bookingChange} />

                    <input type="email" placeholder="Contact Email"
                        className="bookingEmail text-input form-input"
                        name="bookingEmail" value={bookingEmail}
                        onChange={props.bookingChange} />

                    <Select placeholder="Select A Class Type"
                            className="bookingType form-input"
                            name="bookingType" value={bookingType}
                            onChange={props.bookingTypeChange}
                            options={typeOptions} />

                    <Select placeholder="Select Participants"
                            className="bookingParticipants form-input"
                            name="bookingParticipants" value={bookingParticipants}
                            onChange={props.bookingParticipantsChange}
                            options={participantsOptions} />

                    <Select placeholder="Select A Date"
                            className="bookingDate form-input"
                            name="bookingDate" value={bookingDate}
                            onChange={props.bookingDateChange}
                            options={dates} />

                    <textarea placeholder="Comments or Questions?" 
                            rows="5" className="bookingComments form-input"
                            name="bookingComments" value={bookingComments}
                            onChange={props.bookingChange} />
                </div>
                <div className="bookingConfirm">
                    <div>
                        <div>Total: {total.toString() + " " + props.renderElement("Book", "currency", "USD")}</div>
                        <input placeholder="Enter Discount Code" className="discountText"
                                name="bookingDiscount" value={bookingDiscount} onChange={props.bookingChange} />
                                <br />
                        <button className="discountButton" onClick={props.bookingCheckDiscount}>Check Discount</button>
                    </div>
                    <PaypalSmartButton value={total} currency={currency} description={bookingType} book={props.book} />
                </div>
        </div>
    )
};

export default Book;


/*
<button onClick={() => {
                        const xhr = new XMLHttpRequest();
                        const data = new FormData();
                        let info = Object.assign({}, props.book);
                        info['currency'] = currency;
                        info['value'] = total;
                        data.append("data", JSON.stringify(info));
                        console.log(data.entries);
                        xhr.onload = () => console.log(xhr.response);
                        xhr.open('POST', '/api/create-payment');
                        xhr.send(data);
                    }}>
                        <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-large.png"
                             alt="Check out with PayPal" />
                    </button>
*/