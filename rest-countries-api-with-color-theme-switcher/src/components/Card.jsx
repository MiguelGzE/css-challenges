import React from "react";
import "../styles/Card.scss";

function Card({ data = null, onCardClick = null }) {
    let { flags: { png: urlImage }, name: { common: name }, population, region, capital } = data;
    const POPULATION_STRING = population.toLocaleString();
    return (
        <div className="c-card" onClick={() => onCardClick(data)}>
            <figure className="c-card__picture">
                <img src={urlImage} alt="" className="c-card__image" />
            </figure>
            <div className="c-card__body">
                <h1 className="c-card__title">{name}</h1>
                <div className="c-card__texts">
                    <p className="c-card__text"><span className="c-card__text--bold">Population: </span>{POPULATION_STRING}</p>
                    <p className="c-card__text"><span className="c-card__text--bold">Region: </span>{region}</p>
                    <p className="c-card__text"><span className="c-card__text--bold">Capital: </span>{capital?.length > 0 ? capital[0] : 'S/C'}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;