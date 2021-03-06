import React from "react";
import { useParams } from "react-router";
import { Route, useRouteMatch, useLocation, Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useCustomHook } from "../../context";
import HighlightedQuote from "../quotes/HighlightedQuote";
import { getSingleQuote } from "../../lib/api";
import { useEffect } from "react/cjs/react.development";
import LoadingSpinner from "../UI/LoadingSpinner";
import useHttp from "../../hooks/use-http";
export default function QuoteDetail() {
  const match = useRouteMatch();
  const {
    sendRequest,
    status,
    data: loadedQuote, // renaming the data returned from useHttp
    error,
  } = useHttp(getSingleQuote, true);

  // Get :quoteID that brought us to this page (route parameter value from App.js)
  const params = useParams();
  const quoteID = params.quoteID;
  //% Grabs a quote from Firebase everytime quoteID changes (or sendRequest)
  useEffect(() => {
    sendRequest(quoteID); // async function should be inside useEffect
  }, [sendRequest, quoteID]); 

  //# Conditional Return JSX Area -----------------------------
  //# ORDER: pending → error → found nothing → success JSX
  if (status === "pending") {
    return (
      <div className="centered">
        PLACEHOLDER FOR LOADING SPINNER
      </div>
    );
  }
  if (error) {
    return <p className="centered">{error}</p>;
  }
  if (!loadedQuote.text) return <p>No quote found!</p>;
  const pathToQuotesIDPage = match.url;
  const pathToCommentsPage = `${match.url}/comments`;
  return (
    <>
      <HighlightedQuote author={loadedQuote.author} text={loadedQuote.text} />
      {/* We're already inside the next route that follows */}
      <Route path={pathToQuotesIDPage} exact>
        <div className="centered">
          <Link to={pathToCommentsPage} className="btn--flat">
            Load Comments
          </Link>
        </div>
      </Route>
      {/* This route's taken if we press the "load comments" button */}
      <Route path={pathToCommentsPage} exact>
        <Comments quoteID={quoteID} />
      </Route>
    </>
  );
}
/*
http://localhost:3000/quotes/q1
*/
