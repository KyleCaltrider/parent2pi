import React from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';

// Component Imports
import Navigation from './components/Navigation';
import Home from './components/Home';
import Tips from './components/Tips';
import Book from './components/Book';


import parent2pi_logo from './images/parent2pi_logo.png';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: "",
      display: "Home",
      pages: [],
      bookingParticipants: "",
      bookingName: "",
      bookingEmail: "",
      bookingDate: "",
      bookingType: "",
      bookingComments: ""
    }
    this.toggleNav = this.toggleNav.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.updatePages = this.updatePages.bind(this);
    this.renderPageElement = this.renderPageElement.bind(this);
    this.bookingChange = this.bookingChange.bind(this);
    this.bookingTypeChange = this.bookingTypeChange.bind(this);
    this.bookingParticipantsChange = this.bookingParticipantsChange.bind(this);
    this.bookingDateChange = this.bookingDateChange.bind(this);

  }

  componentDidMount() {
    // On page mount, retrieve site content and Etsy shop listings
    this.updatePages();
  }

  toggleNav() {
    this.setState({nav: this.state.nav === "active" ? "" : "active"});
  }

  changeDisplay(view) {
    this.setState({display: view});
  }

  updatePages() {
    const xhr = new XMLHttpRequest();
    xhr.onload = async() => {
      if (xhr.response) {
        try {
          let pages = await JSON.parse(xhr.response);
          console.log(pages);
          this.setState({pages: pages});
        }
        catch(err) {
          console.error(err);
        }
      }
    }
    xhr.open("GET", "/api/update");
    xhr.send();
  }

  renderDisplay() {
    // Selectively renders View components based off the "display" state value.
    // This should probably be replaced by BrowserRouter...but currently it works.
    let book = Object.assign({}, this.state);
    for (let key in book) {
      if (!key.includes("book")) delete book[key];
    }
    const bookPage = this.state.pages.find(p => p.name === "Book");

    const views = { 
      'Home': <Home pages={this.state.pages} renderElement={this.renderPageElement} />,
      'Tips': <Tips renderElement={this.renderPageElement} />,
      'Book': <Book renderElement={this.renderPageElement}
                    book={book} page={bookPage}
                    bookingChange={this.bookingChange}
                    bookingTypeChange={this.bookingTypeChange}
                    bookingDateChange={this.bookingDateChange}
                    bookingParticipantsChange={this.bookingParticipantsChange} />
    };
    return views[this.state.display];
  };

  renderPageElement(page, el, alt="") {
    // Looks up and returns a particular site content element
    // given a page [String] it's on, and what it's called [el: String].
    // ex: page = "Home", el = "shop"
    // Falls back to the alt [String] argument
    
    const { pages } = this.state;
    page = pages.find(p => p.name === page);
    if (page) {
      if (page.contents[el]) return page.contents[el]
      else return alt;
    }
    else {
      console.log("Page Not Found");
      return alt;
    }
  }

  bookingChange(e) {
    let value = e.target.value,
        name = e.target.name;
    let state = {};
    state[name] = value;
    this.setState(state);
  }

  bookingTypeChange(bookingType) {
    bookingType = bookingType.value;
    this.setState({bookingType});
  }
  bookingParticipantsChange(bookingParticipants) {
    bookingParticipants = bookingParticipants.value;
    this.setState({bookingParticipants});
  }

  bookingDateChange(bookingDate) {
    bookingDate = bookingDate.value;
    this.setState({bookingDate});
  }


  render() {
    let year = new Date();
    year = year.getFullYear();
    return (
      <div className="App">
        <header id="header">
          <img src={parent2pi_logo} alt="Company Logo" />
          <p>{this.renderPageElement("Home", "company", "Loading Company...")}</p>
        </header>
        <Navigation toggleNav={this.toggleNav} nav={this.state.nav} changeDisplay={this.changeDisplay} renderElement={this.renderPageElement} />
        {this.renderDisplay()}
        <div id="footer-email">
          <div>
            <a href={"mailto:" + this.renderPageElement("Home", "email", "Loading Email...")}>{this.renderPageElement("Home", "email", "Loading Email...")}</a>
          </div>
        </div>
        <footer>
          <ReactMarkdown source={this.renderPageElement("Home", "company", "Loading Company...") + " " + year + " | Design by Kyle Caltrider"} />
        </footer>
      </div>
    );
  }
}

export default App;
