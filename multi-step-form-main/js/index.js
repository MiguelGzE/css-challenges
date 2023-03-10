$(function () {
    // $('#sidebar .l-list__item').click(function () {
    //     let stepSelected = $(this).attr('id');
    //     stepSelected = parseInt(stepSelected.split('-')[1]);
    //     changeStep(stepSelected);
    // });

    $('#card').on('focusout', 'input', function () {
        const INPUT_VALUE = $(this).val();
        if (INPUT_VALUE == '' || INPUT_VALUE == null) {
            const NAME = $(this).attr('name');
            const TEXT_ERROR = 'This field is required';
            setTextError(NAME, TEXT_ERROR);
            return;
        }

        if ($(this).hasClass('is-invalid')) {
            $(this).removeClass('is-invalid');
        }
    });

    $('#card').on('click', '#card-plan .c-container--plan', function () {
        let planIdSelected = $(this).attr('id').split('plan-')[1];
        let planData = MAIN.getPlanData();
        if (planData && planIdSelected === planData['plan_selected']) {
            return;
        }
        removeClassOfElements('c-container--plan', 'is-selected');
        $(this).addClass('is-selected');
        planData['plan_selected'] = planIdSelected;
        MAIN.setPlanData(planData);
    });

    $('#card').on('change', '#card-plan #checkbox-plan', function () {
        $('#card-plan').toggleClass('is-yearly-plan');
        const IS_YEARLY_PLAN = $(this).is(":checked");
        let typePlanSelected = IS_YEARLY_PLAN ? 'yearly' : 'monthly';
        let planData = MAIN.getPlanData();
        planData['type_plan_selected'] = typePlanSelected;
        planData['is_yearly_plan'] = IS_YEARLY_PLAN;
        MAIN.setTypePlanSelected(typePlanSelected);
        MAIN.setPlanData(planData);
        let listPlans = $('#card-plan').children('.l-form__body').children('.c-container--plan');
        listPlans.each(function () {
            const PLAN_ID = $(this).attr('id').split('plan-')[1];
            const PLAN = MAP_PLANS.get(PLAN_ID);
            const PRICE = getPlanPrice(PLAN['price_monthly']);
            $(this).find('.c-texts__subtitle').text(PRICE['price_string']);
        });
    });

    $('#card').on('click', '#card-pick-add-on .c-container--add-on', function () {
        $(this).toggleClass('is-selected');
    });

    $('#next-step').on('click', function () {
        let step = MAIN.getCurrentStep();
        let isValid = true;
        if (step <= 2) {
            isValid = validateByStep(step);
        } else if (step == 3) {
            saveAddOnsSelected();
        }
        if (!isValid) {
            return;
        }

        step += 1;
        changeStep(step);
    });

    $('#go-back').on('click', function () {
        let step = MAIN.getCurrentStep();
        step -= 1;
        changeStep(step);
    });

    $('#card').on('click', '#summary a.c-texts__subtitle', function () {
        const STEP_PLAN = 2;
        changeStep(STEP_PLAN);
    });

});

function saveAddOnsSelected() {
    let addOnsData = MAIN.getAddOnsData();
    addOnsData['list_add_ons_selected'] = [];
    let listAddOns = $('#card-pick-add-on').children('.l-form__body').children('.c-container--add-on');
    listAddOns.each(function () {
        const ADD_ON_ID = $(this).attr('id').split('add-on-')[1];
        if ($(this).hasClass('is-selected')) {
            addOnsData['list_add_ons_selected'].push(ADD_ON_ID);
        }
    });
    MAIN.setAddOnsData(addOnsData);
}

function validateSelectedPlan() {
    let planData = MAIN.getPlanData();
    return planData && planData['plan_selected'];
}

function validatePersonalInfo() {
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validatePhone = (phone) => {
        return phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    };

    let arrayInputsPersonalInfo = $("form").serializeArray();
    let personalInfo = {};
    $.each(arrayInputsPersonalInfo, function (i, field) {
        personalInfo[field.name] = field.value;
    });

    let validName, validEmail, validPhone = false;
    validName = (personalInfo && personalInfo['name'] != '' && personalInfo['name'] != null);
    if (!validName) {
        setTextError('name', 'Invalid name');
    }

    validEmail = validateEmail(personalInfo['email_address']);
    if (!validEmail) {
        setTextError('email_address', 'Invalid email address');
        validEmail = false;
    }

    validPhone = validatePhone(personalInfo['phone_number']);
    if (!validPhone) {
        setTextError('phone_number', 'Invalid phone number');
        validEmail = false;
    }

    if (!validName || !validEmail || !validPhone) {
        return false;
    }

    MAIN.setPersonalInfoData(personalInfo);
    return true;
}

function setTextError(inputName, textError) {
    let input = $(`input[name="${inputName}"]`);
    input.addClass('is-invalid');
    input.next().text(textError);
}

function validateByStep(step) {
    let isValid = false;
    switch (step) {
        case 1:
            isValid = validatePersonalInfo();
            break;
        case 2:
            isValid = validateSelectedPlan()
            break;
        default:
            break;
    }
    return isValid;
}

function changeStep(newStep) {
    MAIN.setCurrentStep(newStep);
    removeClassOfElements('l-list__item', 'is-active');
    MAIN.setStepHtmlTemplate();
}

function removeClassOfElements(elements, className) {
    $("." + elements).each(function () {
        $(this).removeClass(className);
    });
}

const MAP_PLANS = new Map([
    ['arcade', { icon: 'icon-arcade.svg', title: 'Arcade', price_monthly: 9 }],
    ['advanced', { icon: 'icon-advanced.svg', title: 'Advanced', price_monthly: 12 }],
    ['pro', { icon: 'icon-pro.svg', title: 'Pro', price_monthly: 15 }],
]);

const MAP_ADD_ONS = new Map([
    ['online-service', { title: 'Online service', paragraph: 'Access to multiplayer games', price_monthly: 1 }],
    ['larger-storage', { title: 'Larger storage', paragraph: 'Extra 1TB of cloud save', price_monthly: 2 }],
    ['customizable-profile', { title: 'Customizable profile', paragraph: 'Custom theme on your profile', price_monthly: 2 }],
]);

function getPlanPriceString(price, isYearlyPlan) {
    const TYPE = isYearlyPlan ? 'yr' : 'mo';
    return `$${price}/${TYPE}`;
}

function getPlanPrice(priceMonthly) {
    const IS_YEARLY_PLAN = MAIN.getPlanData()['is_yearly_plan'];
    let planPrice = { price: priceMonthly, price_string: getPlanPriceString(priceMonthly, IS_YEARLY_PLAN) };
    if (!IS_YEARLY_PLAN) {
        return planPrice;
    }

    let amountMonthsToBePaidPerYear = 10;
    planPrice['price'] = priceMonthly * amountMonthsToBePaidPerYear;
    planPrice['price_string'] = getPlanPriceString(planPrice['price'], IS_YEARLY_PLAN);
    return planPrice;
}

function getDataSelectedPlan(planId) {
    return MAP_PLANS.get(planId) ?? null;
}

function getDataAddOn(addOnId) {
    return MAP_ADD_ONS.get(addOnId) ?? null;
}

const MAIN = (function () {
    let _firstTemplate = 1;
    let _currentStep = _firstTemplate;
    let _personalInfoData = {};
    let _typePlanSelected = 'monthly';
    let _planData = { plan_selected: null, type_plan_selected: _typePlanSelected, is_yearly_plan: false };
    let _addOnsData = { list_add_ons_selected: [] };

    const getCurrentStep = function () {
        return _currentStep;
    }

    const setCurrentStep = function (step) {
        _currentStep = step;
        return _currentStep;
    }

    const getPersonalInfoData = function () {
        return _personalInfoData;
    }

    const setPersonalInfoData = function (personalInfoData) {
        _personalInfoData = personalInfoData;
        return _personalInfoData;
    }

    const getTypePlanSelected = function () {
        return _typePlanSelected;
    }

    const setTypePlanSelected = function (typePlanSelected) {
        _typePlanSelected = typePlanSelected;
        return _typePlanSelected;
    }

    const getPlanData = function () {
        return _planData;
    }

    const setPlanData = function (planData) {
        _planData = planData;
        return _planData;
    }

    const getAddOnsData = function () {
        return _addOnsData;
    }

    const setAddOnsData = function (addOnsData) {
        _addOnsData = addOnsData;
        return _addOnsData;
    }

    const getDataVariableByCurrentStep = function () {
        const DEFAULT_DATA = {};
        const MAP_DATA = new Map([
            [1, _personalInfoData],
            [2, _planData],
            [3, _addOnsData]
        ]);
        const STEP_DATA = MAP_DATA.get(_currentStep) || DEFAULT_DATA;
        return STEP_DATA;
    }

    const getStepData = function () {
        let stepData = {};
        stepData['step'] = _currentStep;
        stepData = Object.assign(stepData, getDataVariableByCurrentStep());
        if (_currentStep > 2) {
            stepData = Object.assign(stepData, _planData);
            stepData['is_yearly_plan'] = _typePlanSelected && _typePlanSelected === 'yearly' ? true : false;
        }
        if (_currentStep == 4) {
            stepData = Object.assign(stepData, _addOnsData);
        }
        return stepData;
    }

    const setStepFooter = function () {
        if (_currentStep === 1) {
            $('#go-back').hide();
            return;
        }
        if (_currentStep > 1) {
            $('#go-back').show();
            if (!($('#next-step').hasClass('c-footer__button--next'))) {
                $('#next-step').removeClass('c-footer__button--confirm');
                $('#next-step').addClass('c-footer__button--next');
                $('#next-step').text('Next Step');
            }
        }
        if (_currentStep === 4) {
            $('#next-step').removeClass('c-footer__button--next');
            $('#next-step').addClass('c-footer__button--confirm');
            $('#next-step').text('Confirm');
        }

        if (_currentStep === 5) {
            $('.c-footer').hide();
            $('#card').addClass('c-card--thank-you');
        }
    }

    const setStepHtmlTemplate = function () {
        let indexCurrentStep = _currentStep - 1;
        $(".l-list__item").eq(indexCurrentStep).addClass('is-active');
        const STEP_DATA = getStepData();
        let htmlTemplate = TEMPLATES.getHtml(STEP_DATA);
        $('#card').html(htmlTemplate);
        setStepFooter();
    }

    return {
        setStepHtmlTemplate,
        getCurrentStep,
        setCurrentStep,
        setPersonalInfoData,
        getPersonalInfoData,
        getTypePlanSelected,
        setTypePlanSelected,
        getPlanData,
        setPlanData,
        getAddOnsData,
        setAddOnsData,
    }
})();

MAIN.setStepHtmlTemplate();