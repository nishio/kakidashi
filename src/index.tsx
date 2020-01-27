import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo)
    // use Sentry later
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      //return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const Router = () => {
  return <HashRouter hashType="noslash">
    <Switch>
      <Route path="/" exact children={<Guide />} />
      <Route path="/k=:key" exact children={<App />} />
    </Switch>
  </HashRouter>
}

const Guide = () => {
  return <a href="https://scrapbox.io/nishio/%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E6%9B%B8%E3%81%8D%E5%87%BA%E3%81%97%E3%83%84%E3%83%BC%E3%83%AB">guide</a>
}
ReactDOM.render(
  <ErrorBoundary>
    <Router />
  </ErrorBoundary>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
