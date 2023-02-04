$(function () {
    $('#sidebar-nav .sidebar__link').click(function () {
        let stepSelected = $(this).attr('id');
        currentStep = parseInt(stepSelected.split('-')[1]);
        removeClassOfElements('sidebar__link', 'sidebar__link--active');
        setStepHtmlTemplate(currentStep);
    });

    $('#card-template').on('click', '#card-plan .card-form__plan', function () {
        removeClassOfElements('card-form__plan', 'plan--selected');
        $(this).addClass('plan--selected');
        selectedPlan = $(this).attr('id');
    });

    $('#card-template').on('change', '#card-plan #checkbox-plan', function () {
        $('#card-plan').toggleClass('yearly-plan');
        typeSelectedPlan = $(this).is(":checked") ? 'yearly' : 'monthly';
        let cardsPlanList = $('#card-plan').children('.card-form__plan');
        const PRICE_KEY = $('#card-plan').hasClass('yearly-plan') ? 'yr' : 'mo';
        cardsPlanList.each(function () {
            const PLAN_ID = $(this).attr('id');
            const PLAN_PRICES = MAP_PRICES.get(PLAN_ID);
            const PRICE = PLAN_PRICES[PRICE_KEY];
            $(this).find('.card-form__plan__price').text(`$${PRICE}/${PRICE_KEY}`);
        });
    });

    $('#next-step').on('click', function () {
        currentStep += 1;
        removeClassOfElements('sidebar__link', 'sidebar__link--active');
        setStepHtmlTemplate(currentStep);
    });

    $('#go-back').on('click', function () {
        currentStep -= 1;
        removeClassOfElements('sidebar__link', 'sidebar__link--active');
        setStepHtmlTemplate(currentStep);
    });
});

function removeClassOfElements(elements, className) {
    $("." + elements).each(function () {
        $(this).removeClass(className);
    });
}

function getHtmlTemplateByStep(step) {
    const htmlTemplate = MAP_TEMPLATES.get(step) || MAP_TEMPLATES.get(firstTemplate);
    return htmlTemplate;
}

function setStepHtmlTemplate(step) {
    let indexCurrentStep = step - 1;
    $(".sidebar__link").eq(indexCurrentStep).addClass('sidebar__link--active');
    // let cardId = getHtmlTemplateByStep(step);
    // $(`#${cardId}`).toggleClass('card--active');
    let card = document.getElementById('card-template');
    const htmlTemplate = getHtmlTemplateByStep(step);

    if (step == 2) {
        if (typeSelectedPlan == 'yearly') {
            $('#checkbox-plan').prop('checked', true);
            $('#card-plan').addClass('yearly-plan');
        }

        let cardsPlanList = $('#card-plan').children('.card-form__plan');
        const PRICE_KEY = $('#card-plan').hasClass('yearly-plan') ? 'yr' : 'mo';
        cardsPlanList.each(function () {
            const PLAN_ID = $(this).attr('id');
            const PLAN_PRICES = MAP_PRICES.get(PLAN_ID);
            const PRICE = PLAN_PRICES[PRICE_KEY];
            $(this).find('.card-form__plan__price').text(`$${PRICE}/${PRICE_KEY}`);
        });
        console.log(selectedPlan);
        if (selectedPlan) {
            $(`#${selectedPlan}`).addClass('plan--selected');
        }
    }

    card.innerHTML = htmlTemplate;

}

const TEMPLATE_STEP_1 = '<h1 class="card__title">Personal info</h1><p class="card__paragraph">Please provide your name, email address, and phone number.</p><form action="" class="card-form"><div class="card-form__group"><label for="" class="card-form__group__label">Name</label><input type="text" placeholder="e.g. Stephen King" class="card-form__group__input"></div><div class="card-form__group"><label for="" class="card-form__group__label">Email Address</label><input type="email" placeholder="e.g. stephenking@lorem.com" class="card-form__group__input"></div><div class="card-form__group"><label for="" class="card-form__group__label">Phone Number</label><input type="text" placeholder="e.g. +1 234 567 890" class="card-form__group__input"></div></form>';
const TEMPLATE_STEP_2 = '<h1 class="card__title">Select your plan</h1><p class="card__paragraph">You have the option of monthly or yearly billing.</p><form action="" class="card-form card-form--plan" id="card-plan"><div class="card-form__plan" id="arcade-plan"><img src="assets/images/icon-arcade.svg" alt=""><div class="card-form__plan__texts"><p class="card-form__plan__title">Arcade</p><p class="card-form__plan__price">$9/mo</p><p class="card-form__plan__price-year">2 months free</p></div></div><div class="card-form__plan" id="advanced-plan"><img src="assets/images/icon-advanced.svg" alt=""><div class="card-form__plan__texts"><p class="card-form__plan__title">Advanced</p><p class="card-form__plan__price">$12/mo</p><p class="card-form__plan__price-year">2 months free</p></div></div><div class="card-form__plan" id="pro-plan"><img src="assets/images/icon-pro.svg" alt=""><div class="card-form__plan__texts"><p class="card-form__plan__title">Pro</p><p class="card-form__plan__price">$15/mo</p><p class="card-form__plan__price-year">2 months free</p></div></div><div class="card-form__select-plan"><span class="monthly-plan">Monthly</span><label class="select-plan__switch"><input class="switch__checkbox" id="checkbox-plan" type="checkbox"><span class="switch__slider round"></span></label><span class="yearly-plan">Yearly</span></div></form>';
const MAP_PRICES = new Map([
    ['arcade-plan', { mo: 9, yr: 90 }],
    ['advanced-plan', { mo: 12, yr: 120 }],
    ['pro-plan', { mo: 15, yr: 150 }],
]);

// const MAP_TEMPLATES = new Map([
//     [1, 'card-personal-info'],
// [2, TEMPLATE_STEP_2],
// [3, 'Prueba3'],
// [4, 'Prueb4'],
// ]);

const MAP_TEMPLATES = new Map([
    [1, TEMPLATE_STEP_1],
    [2, TEMPLATE_STEP_2],
    [3, 'Prueba3'],
    [4, 'Prueb4'],
]);

let firstTemplate = 1;
let currentStep = firstTemplate;
let selectedPlan = null;
let typeSelectedPlan = 'monthly';
// let selectedPlanPrices = null;
setStepHtmlTemplate(currentStep);



// let sidebarEvent = document.querySelector('.sidebar__nav').addEventListener('click', e => {
//     const classList = e.target.classList;
//     if (classList.contains('sidebar__link')) {
//         let stepSelected = e.target.id;
//         setStepTemplate(stepSelected);
//     }
// });
