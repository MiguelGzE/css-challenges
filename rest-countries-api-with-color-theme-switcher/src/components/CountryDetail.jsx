import { React } from "react";
import "../styles/CountryDetail.scss"

function CountryDetail({ data, goBack }) {
    let { flags: { png: urlImage, alt: altImage }, name, population, region, subregion, capital } = data;
    console.log('CountryDetail ~ data', data)
    const LIST_LANGUAGES = data.languages ? Object.entries(data.languages) : [];
    const KEY_LANGUAGE = LIST_LANGUAGES.length > 0 ? LIST_LANGUAGES[0][0] : null;
    const NATIVE_NAME = (KEY_LANGUAGE && name.nativeName && name.nativeName[KEY_LANGUAGE]?.official) ?
        name.nativeName[KEY_LANGUAGE]['official'] : name.official;
    const CAPITAL = capital?.length > 0 ? capital[0] : 'Unknown';
    const LIST_BORDER_COUNTRIES = data.borders?.length > 0 ? data.borders : [];
    const TOP_LEVEL_DOMAIN = data.tld?.length > 0 ? data.tld[0] : 'Unknown';
    const LANGUAGES_STRING = LIST_LANGUAGES.length ? LIST_LANGUAGES.map(([key, value]) => { return value }).join(', ') : 'Unknown';
    const POPULATION_STRING = population.toLocaleString();
    const LIST_CURRENCIES = Object.values(data.currencies);
    const CURRENCIES_STRING = LIST_CURRENCIES.length ? LIST_CURRENCIES.map((currencie) => { return currencie.name }).join(', ') : 'Unknown';

    return (
        <div className="c-container">
            <div className="c-container__header">
                <button className="c-element-rounded c-element-rounded--button" onClick={goBack}>Back</button>
            </div>
            <div className="c-container__body">
                <figure className="c-container__picture">
                    <img src={urlImage} alt={altImage} className="c-container__image" />
                </figure>
                <h1 className="c-container__title">{name.common}</h1>
                <div className="c-container__texts c-container__texts--main">
                    <p className="c-container__text"><span className="c-container__text--bold">Native Name: </span>{NATIVE_NAME}</p>
                    <p className="c-container__text"><span className="c-container__text--bold">Population: </span>{POPULATION_STRING}</p>
                    <p className="c-container__text"><span className="c-container__text--bold">Region: </span>{region}</p>
                    <p className="c-container__text"><span className="c-container__text--bold">Sub Region: </span>{subregion}</p>
                    <p className="c-container__text"><span className="c-container__text--bold">Capital: </span>{CAPITAL}</p>
                </div>
                <div className="c-container__texts c-container__texts--secondary">
                    <p className="c-container__text"><span className="c-container__text--bold">Top Level Domain: </span>{TOP_LEVEL_DOMAIN}</p>
                    <p className="c-container__text"><span className="c-container__text--bold">Currencies: </span>{CURRENCIES_STRING}</p>
                    <p className="c-container__text"><span className="c-container__text--bold">Languages: </span>{LANGUAGES_STRING}</p>
                </div>
                {LIST_BORDER_COUNTRIES?.length > 0 && (<div className="c-container__footer">
                    <h4 className="c-container__title">Border Countries:</h4>
                    <div className="c-border-countries">
                        {LIST_BORDER_COUNTRIES.map(
                            (borderCountry) => <div key={`border-${borderCountry}`} className="c-element-rounded">{borderCountry}</div>
                        )}
                    </div>
                </div>)}
            </div>

        </div>
    )
}

export default CountryDetail;