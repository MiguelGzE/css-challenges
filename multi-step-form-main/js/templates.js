const TEMPLATES = (function () {

    const getHTMLForm = function (htmlBody, className, id, htmlFooter = null) {
        let htmlForm = `<form action="#" class="l-form ${className}" id="${id}">
            <div class="l-form__body">`;
        htmlForm += htmlBody;
        htmlForm += '</div>';
        if (htmlFooter) {
            htmlForm += '<div class="l-form__footer">';
            htmlForm += htmlFooter;
            htmlForm += '</div>';
        }
        htmlForm += '</form>';
        return htmlForm;
    }

    const getTemplateStepFive = function () {
        let template = `<div class="c-container c-container--thank-you" id="thank-you">
            <img class="c-container__icon" src="assets/images/icon-thank-you.svg" alt="">
            <div class="c-texts c-texts--thank-you">
            <h1 class="c-card__title">Thank you!</h1>
            <p class="c-card__paragraph">Thanks for confirming your subscription! We hope you have fun
                using our platform. If you ever need support, please feel free
                to email us at support@loremgaming.com.</p>
            </div>
        </div>`;
        return template;
    }

    const getTemplateStepFour = function (data) {
        const PLAN_SELECTED_DATA = getDataSelectedPlan(data['plan_selected']);
        const IS_YEARLY_PLAN = data['is_yearly_plan'];
        const TITLES_BY_TYPE_PLAN_SELECTED = IS_YEARLY_PLAN ? { title: 'Yearly', title_footer: 'year' } : { title: 'Monthly', title_footer: 'month' };
        const TITLE_SUMMARY = `${PLAN_SELECTED_DATA['title']} ( ${TITLES_BY_TYPE_PLAN_SELECTED['title']})`;
        const SUMMARY_PRICE = getPlanPrice(PLAN_SELECTED_DATA['price_monthly']);
        let template = `<div class="c-container c-container--summary" id="summary">
        <div class="c-container">
            <div class="c-texts c-texts--titles">
            <p class="c-texts__title">${TITLE_SUMMARY}</p>
            <a href="javascript:void(0)" class="c-texts__subtitle">Change</a>
            </div>
            <div class="c-texts c-texts--titles">
            <p class="c-texts__title">${SUMMARY_PRICE['price_string']}</p>
            </div>
        </div>`;

        let priceTotal = SUMMARY_PRICE['price'];
        const LIST_ADD_ONS_SELECTED = data?.list_add_ons_selected ?? [];
        if (LIST_ADD_ONS_SELECTED.length > 0) {
            template += `<div class="c-line"></div><ul class="l-list l-list--summary">`;

            LIST_ADD_ONS_SELECTED.forEach(addOnSelected => {
                const ADD_ON_DATA = getDataAddOn(addOnSelected);
                console.log(ADD_ON_DATA);
                const ADD_ON_PRICE = getPlanPrice(ADD_ON_DATA['price_monthly']);
                priceTotal += ADD_ON_PRICE['price'];
                template += `<li class="l-list__item">
                    <div class="c-texts c-texts--summary" >
                  <p class="c-texts__title">${ADD_ON_DATA['title']}</p>
                  <p class="c-texts__subtitle">+${ADD_ON_PRICE['price_string']}</p>
                </div>
              </li > `;
            });
            template += `</ul></div>`;
        }

        let priceTotalString = getPlanPriceString(priceTotal);
        const FOOTER_TEMPLATE = `<div class="l-form__footer">
            <div class="c-texts c-texts--summary">
            <p class="c-texts__title">Total (per ${TITLES_BY_TYPE_PLAN_SELECTED['title_footer']})</p>
            <p class="c-texts__text c-texts__text--price">+${priceTotalString}</p>
            </div>
        </div>`;
        template = getHTMLForm(template, 'l-form--full', 'card-summary', FOOTER_TEMPLATE);
        return template;
    }

    const getTemplateStepThree = function (data) {
        const LIST_ADD_ONS_SELECTED = data?.list_add_ons_selected ?? [];
        let template = '';
        MAP_ADD_ONS.forEach((addOn, addOnId) => {
            const ADD_ON_PRICE = getPlanPrice(addOn['price_monthly']);
            const CLASS_IS_SELECTED = LIST_ADD_ONS_SELECTED.length > 0 && LIST_ADD_ONS_SELECTED.includes(addOnId) ? 'is-selected' : '';
            template += `<div class="c-container c-container--bordered c-container--add-on ${CLASS_IS_SELECTED}" id="add-on-${addOnId}">
            <div class="c-checkbox c-container-icon"></div>
            <div class="c-texts c-texts--add-on">
              <p class="c-texts__title">${addOn['title']}</p>
              <p class="c-texts__subtitle">${addOn['paragraph']}</p>
            </div>
            <div class="c-texts c-texts--add-on">
              <p class="c-texts__text">+${ADD_ON_PRICE['price_string']}</p>
            </div>
          </div>`;
        });
        template = getHTMLForm(template, 'l-form--add-on', 'card-pick-add-on');
        return template;
    }

    const getTemplateStepTwo = function (data) {
        const YEARLY_TEXT = '2 months free';
        const IS_YEARLY_PLAN = data['is_yearly_plan'];
        const PLAN_SELECTED = data['plan_selected'];
        let template = '';
        MAP_PLANS.forEach((plan, planId) => {
            const CLASS_IS_SELECTED = PLAN_SELECTED && PLAN_SELECTED === planId ? ' is-selected' : '';
            const PLAN_PRICE = getPlanPrice(plan['price_monthly']);
            template += `<div class="c-container c-container--bordered c-container--plan ${CLASS_IS_SELECTED}" id="plan-${planId}">
                <img class="c-container__icon" src="assets/images/${plan['icon']}" alt="${plan['title']}">
                <div class="c-texts c-texts--plan">
                    <p class="c-texts__title">${plan['title']}</p>
                    <p class="c-texts__subtitle">${PLAN_PRICE['price_string']}</p>
                    <span class="c-texts__paragraph">${YEARLY_TEXT}</span>
                </div>
            </div>`;
        });

        const CHECKBOX_SELECT_PLAN = IS_YEARLY_PLAN ? 'checked=checked' : '';
        let FOOTER_TEMPLATE = `<div class="c-container c-container--select-plan">
            <span class="c-container__title">Monthly</span>
            <label class="c-switch">
                <input class="c-switch__checkbox" id="checkbox-plan" type="checkbox" ${CHECKBOX_SELECT_PLAN}">
                <span class="c-switch__slider round"></span>
            </label>
            <span class="c-container__title--muted">Yearly</span>
        </div>`;
        const CLASS_STRING = 'l-form--full l-form--plan' + (IS_YEARLY_PLAN ? ' is-yearly-plan' : '');
        template = getHTMLForm(template, CLASS_STRING, 'card-plan', FOOTER_TEMPLATE);
        return template;
    }

    const getTemplateStepOne = function (data) {
        const NAME_VALUE = data?.name ?? '';
        const EMAIL_VALUE = data?.email_address ?? '';
        const PHONE_VALUE = data?.phone_number ?? '';

        let inputsList = [
            { 'label': 'Name', 'type': 'text', 'name': 'name', 'value': NAME_VALUE, 'placeholder': 'e.g. Stephen King' },
            { 'label': 'Email Address', 'type': 'email', 'name': 'email_address', 'value': EMAIL_VALUE, 'placeholder': 'e.g. stephenking@lorem.com' },
            { 'label': 'Phone Number', 'type': 'text', 'name': 'phone_number', 'value': PHONE_VALUE, 'placeholder': 'e.g. +1 234 567 890' }
        ];

        let template = '';

        for (const input of inputsList) {
            template += `<div class="c-container c-container--personal-info">
            <label for="${input['name']}" class="c-container__label">${input['label']}</label>
            <input type="${input['type']}" value="${input['value']}" placeholder="${input['placeholder']}" class="c-container__input" name="${input['name']}">
            <span class="c-is-invalid">This file is required</span>
            </div>`;
        }

        template = getHTMLForm(template, 'l-form--personal-info', 'card-personal-info');
        return template;
    }

    const MAP_STEP_HEADERS = new Map([
        [1, { title: 'Personal info', paragraph: 'Please provide your name, email address, and phone number.' }],
        [2, { title: 'Select your plan', paragraph: 'You have the option of monthly or yearly billing.' }],
        [3, { title: 'Pick add-ons', paragraph: 'Add-ons help enhance your gaming experience.' }],
        [4, { title: 'Finishing up', paragraph: 'Double-check everything looks OK before confirming.' }],
    ]);

    const getHeaderByStep = function (step) {
        const DEFAULT_DATA = null;
        const STEP_DATA = MAP_STEP_HEADERS.get(step) || DEFAULT_DATA;
        return STEP_DATA;
    }

    function getHtmlTemplateByStep(step, data) {
        let htmlTemplate = '';
        switch (step) {
            case 1:
                htmlTemplate = getTemplateStepOne(data);
                break;
            case 2:
                htmlTemplate = getTemplateStepTwo(data);
                break;
            case 3:
                htmlTemplate = getTemplateStepThree(data);
                break;
            case 4:
                htmlTemplate = getTemplateStepFour(data);
                break;
            case 5:
                htmlTemplate = getTemplateStepFive();
                break;
            default:
                htmlTemplate = '';
                break;
        }
        return htmlTemplate;
    }

    const getCardHeaderHtml = function (cardHeaders) {
        return `<h1 class="c-card__title">${cardHeaders['title']}</h1>
        <p class="c-card__paragraph">${cardHeaders['paragraph']}</p>`
    }

    const getHtml = function (data) {
        let step = data['step'];
        const CARD_HEADERS = getHeaderByStep(step);
        let html = '';
        if (step < 5 && !CARD_HEADERS) {
            return html;
        }
        if (step < 5) {
            html += getCardHeaderHtml(CARD_HEADERS);
        }
        html += getHtmlTemplateByStep(step, data);
        return html;
    }

    return {
        getHtml
    }
})();