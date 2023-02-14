import React from "react";
import "../styles/Filter.scss";

function Filter({ filterBySearch, filterByRegion }) {

    const listRegions = [{ name: 'Africa' }, { name: 'America' }, { name: 'Asia' }, { name: 'Europe' }, { name: 'Oceania' }];

    return (
        <div className="l-filter">
            <div className="c-search">
                <span className="c-search__icon">Q</span>
                <input className="c-search__input" type="text" name="" id="" placeholder="Search for a country..." onChange={(e) => filterBySearch(e.target.value)} />
            </div>

            <div className="c-dropdown">
                <div className="c-dropdown_titles">
                    <p className="c-dropdown__title">Filter by Region</p>
                    <span className="c-dropdown__icon">&gt;</span>
                </div>
                <div className="c-dropdown__content">
                    <ul className="l-list">
                        {listRegions.map(region =>
                            <li key={`item- ${(region.name).toLowerCase()}`} className="l-list__item" onClick={() => filterByRegion(region)}>
                                {region.name}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Filter;