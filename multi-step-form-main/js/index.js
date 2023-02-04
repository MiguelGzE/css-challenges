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
        let planData = main.getPlanData();
        if (planData && planIdSelected === planData['plan_selected']) {
            return;
        }
        removeClassOfElements('c-container--plan', 'is-selected');
        $(this).addClass('is-selected');
        planData['plan_selected'] = planIdSelected;
        main.setPlanData(planData);
    });

    $('#card').on('change', '#card-plan #checkbox-plan', function () {
        $('#card-plan').toggleClass('is-yearly-plan');
        let typePlanSelected = $(this).is(":checked") ? 'yearly' : 'monthly';
        let planData = main.getPlanData();
        planData['type_plan_selected'] = typePlanSelected;
        main.setTypePlanSelected(typePlanSelected);
        main.setPlanData(planData);
        let listPlans = $('#card-plan').children('.l-form__body').children('.c-container--plan');
        const PRICE_KEY = $('#card-plan').hasClass('is-yearly-plan') ? 'yr' : 'mo';
        listPlans.each(function () {
            const PLAN_ID = $(this).attr('id').split('plan-')[1];
            const PLAN_PRICES = MAP_PLAN_PRICES.get(PLAN_ID);
            const PRICE = PLAN_PRICES[PRICE_KEY];
            $(this).find('.c-texts__subtitle').text(`$${PRICE}/${PRICE_KEY}`);
        });
    });

    $('#card').on('click', '#card-pick-add-on .c-container--add-on', function () {
        $(this).toggleClass('is-selected');
    });

    $('#next-step').on('click', function () {
        let step = main.getCurrentStep();
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
        let step = main.getCurrentStep();
        step -= 1;
        changeStep(step);
    });

    $('#card').on('click', '#summary a.c-texts__subtitle', function () {
        const STEP_PLAN = 2;
        changeStep(STEP_PLAN);
    });

});

function saveAddOnsSelected() {
    let addOnsData = main.getAddOnsData();
    addOnsData['list_add_ons_selected'] = [];
    let listAddOns = $('#card-pick-add-on').children('.l-form__body').children('.c-container--add-on');
    listAddOns.each(function () {
        const ADD_ON_ID = $(this).attr('id').split('add-on-')[1];
        if ($(this).hasClass('is-selected')) {
            addOnsData['list_add_ons_selected'].push(ADD_ON_ID);
        }
    });
    main.setAddOnsData(addOnsData);
}

function validateSelectedPlan() {
    let planData = main.getPlanData();
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
    validName = (personalInfo['name'] != '' && personalInfo['name'] != null);
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

    main.setPersonalInfoData(personalInfo);
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
    main.setCurrentStep(newStep);
    removeClassOfElements('l-list__item', 'is-active');
    main.setStepHtmlTemplate();
}

function removeClassOfElements(elements, className) {
    $("." + elements).each(function () {
        $(this).removeClass(className);
    });
}

const MAP_PLAN_PRICES = new Map([
    ['arcade', { mo: 9, yr: 90 }],
    ['advanced', { mo: 12, yr: 120 }],
    ['pro', { mo: 15, yr: 150 }],
]);

const main = (function () {
    let _firstTemplate = 1;
    let _currentStep = _firstTemplate;
    let _personalInfoData = {};
    let _typePlanSelected = 'monthly';
    let _planData = { plan_selected: null, type_plan_selected: _typePlanSelected };
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
        let STEP_DATA = getStepData();
        let url = 'http://localhost/ejercicios_css/retos-frontend/multi-step-form-main/php'
        // url = 'php';
        $.ajax({
            url: url + '/get_template.php',
            type: 'POST',
            data: STEP_DATA,
            dataType: 'html',
            error: function () {
            },
            success: function (htmlTemplate) {
                $('#card').html(htmlTemplate);
                setStepFooter();
            }
        });
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

main.setStepHtmlTemplate();