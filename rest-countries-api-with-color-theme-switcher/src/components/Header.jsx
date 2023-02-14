import React from "react";
import '../styles/Header.scss';

function Header({ theme, toggleTheme }) {
    let themeLabel = theme === 'dark-mode' ? 'Light Mode' : 'Dark Mode';    
    return (
        <section className="c-header">
            <ul className="l-list">
                <li className="l-list__item">
                    <span className="c-header__title">Where in the world?</span>
                </li>
                <li className="l-list__item">
                    <div className="c-theme">
                        <label className="c-theme__label" htmlFor="theme-checkbox">
                            <input className="c-theme__input" onChange={(event) => toggleTheme(event)} type="checkbox" name="theme" id="theme-checkbox" />
                            <span className="c-theme__icon">O</span>
                            {themeLabel}
                        </label>
                    </div>
                </li>
            </ul>
        </section>
    );
}

export default Header;