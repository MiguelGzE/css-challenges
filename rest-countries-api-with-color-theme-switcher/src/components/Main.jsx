import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/Main.scss';
import Card from './Card.jsx';
import CountryDetail from './CountryDetail.jsx';
import Filter from './Filter.jsx';
import { debounce } from 'lodash';

function Main() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [listAllCountries, setListAllCountries] = useState([]);
    const [listCountries, setListCountries] = useState([]);
    const [countrySelected, setCountrySelected] = useState(null);
    // const [searchText, setSearchText] = useState('');
    const previousDataRef = useRef([]);

    const createFetchData = (domain) => (resource) => {
        const url = `${domain}/${resource}`;
        setIsLoaded(false);
        return ({
            get: () => {
                return fetch(url).then((response) => response.json());
            }
        })
    }

    // eslint-disable-next-line
    const fetchData = useCallback(createFetchData('https://restcountries.com/v3.1'), []);

    useEffect(() => {
        const allCountries = fetchData('all');
        allCountries.get().then((response) => {
            let data = response.status >= 400 ? [] : response;
            setListCountries(data);
            setListAllCountries(data);
            setIsLoaded(true);
            previousDataRef.current = data;
        }, (error) => {
            setListCountries([]);
            setIsLoaded(true);
        });
    }, [fetchData]);

    const onCardClick = (countryData) => {
        setCountrySelected(countryData);
    }

    const filterBySearchInput = useCallback((text) => {
        const search = (text.trim()).toLowerCase();
        if (!search || search === '') {
            setListCountries(listAllCountries);
            return;
        }

        const countriesBySearch = fetchData(`name/${search}`);
        countriesBySearch.get().then((response) => {
            let value = response.status >= 400 ? [] : response;
            setListCountries(value);
            setIsLoaded(true);
        }, (error) => {
            setListCountries([]);
            setIsLoaded(true);
        });
    }, [fetchData, listAllCountries])

    const handleInputSearchChange = debounce(filterBySearchInput, 500);

    const handleFilterByRegion = (region) => {
        const regionName = (region.name).toLowerCase();
        const countriesByRegion = fetchData(`region/${regionName}`);
        setIsLoaded(false);
        countriesByRegion.get().then((result) => {
            setListCountries(result);
            setIsLoaded(true);
        }, (error) => {
            setListCountries([]);
            setIsLoaded(true);
        });
    }

    const handleBackEvent = () => {
        setListCountries(listAllCountries);
        setCountrySelected(null);
    }

    let listCards;
    if (countrySelected) {
        console.log(countrySelected);
        listCards = <CountryDetail key={`country_${(countrySelected.name.common).toLowerCase()}`} data={countrySelected} goBack={handleBackEvent} />;
    } else {
        listCards = listCountries.map((country, i) =>
            <Card key={`country_${(country.name.common).toLowerCase()}`} data={country} onCardClick={onCardClick} />
        );
    }

    return (
        <main className='c-main'>
            {!countrySelected && (<div className='c-main__header'>
                <Filter key='filter_component' filterBySearch={handleInputSearchChange} filterByRegion={handleFilterByRegion} />
            </div>)}
            <div className='c-main__body'>
                {isLoaded ? (
                    <>
                        {listCards?.length === 0 && (<div>No se encontraron</div>)}
                        {(countrySelected || listCards?.length > 0) && listCards}
                    </>
                ) : (<div className='c-loading'>
                    <span className='c-loading__label'>Loading data...</span>
                    <span className='c-loader'></span>
                </div>)
                }
            </div>
        </main>
    );
}

export default Main;