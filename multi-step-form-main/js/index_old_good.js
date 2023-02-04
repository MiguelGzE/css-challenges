$(function () {
    // $('#sidebar .l-list__item').click(function () {
    //     let stepSelected = $(this).attr('id');
    //     currentStep = parseInt(stepSelected.split('-')[1]);
    //     removeClassOfElements('l-list__item', 'is-active');
    //     setStepHtmlTemplate(currentStep);
    // });

    $('#card').on('click', '#card-plan .c-container--plan', function () {
        let planId = $(this).attr('id').split('plan-')[1];
        if (planData && planId === planData['plan_selected']) {
            return;
        }

        removeClassOfElements('c-container--plan', 'is-selected');
        $(this).addClass('is-selected');
        planData['plan_selected'] = planId;
    });

    $('#card').on('change', '#card-plan #checkbox-plan', function () {
        $('#card-plan').toggleClass('is-yearly-plan');
        typePlanSelected = $(this).is(":checked") ? 'yearly' : 'monthly';
        planData['type_plan_selected'] = typePlanSelected;
        let listPlans = $('#card-plan').children('.l-form__body').children('.c-container--plan');
        const PRICE_KEY = $('#card-plan').hasClass('is-yearly-plan') ? 'yr' : 'mo';
        listPlans.each(function () {
            const PLAN_ID = $(this).attr('id').split('plan-')[1];
            const PLAN_PRICES = MAP_PLAN_PRICES.get(PLAN_ID);
            const PRICE = PLAN_PRICES[PRICE_KEY];
            $(this).find('.c-texts__subtitle').text(`$${PRICE}/${PRICE_KEY}`);
        });
    });

    $('#card').on('click', '#card-pick-add-on .c-container--pick', function () {
        // console.log($(this));
        $(this).toggleClass('is-selected');
        // if () {

        // }
        // let is_add_on
    });

    $('#next-step').on('click', function () {
        if (currentStep === 1) {
            let arrayInputsPersonalInfo = $("form").serializeArray();
            $.each(arrayInputsPersonalInfo, function (i, field) {
                personalInfoData[field.name] = field.value;
            });
        } else if (currentStep === 3) {
            addOnsData['list_add_ons_selected'] = [];
            let listAddOns = $('#card-pick-add-on').children('.l-form__body').children('.c-container--pick');
            listAddOns.each(function () {
                const ADD_ON_ID = $(this).attr('id').split('pick-')[1];
                if ($(this).hasClass('is-selected')) {
                    addOnsData['list_add_ons_selected'].push(ADD_ON_ID);
                }
            });
        }
        currentStep += 1;
        removeClassOfElements('l-list__item', 'is-active');
        setStepHtmlTemplate(currentStep);
    });

    $('#go-back').on('click', function () {
        currentStep -= 1;
        removeClassOfElements('l-list__item', 'is-active');
        setStepHtmlTemplate(currentStep);
    });

});

function removeClassOfElements(elements, className) {
    $("." + elements).each(function () {
        $(this).removeClass(className);
    });
}

function getDataVariableByStep(step) {
    const DEFAULT_DATA = {};
    const MAP_DATA = new Map([
        [1, personalInfoData],
        [2, planData],
        [3, addOnsData],
        [4, {}]
    ]);
    const STEP_DATA = MAP_DATA.get(step) || DEFAULT_DATA;
    return STEP_DATA;
}

function getStepData() {
    let stepData = {};
    stepData['step'] = currentStep;
    stepData = Object.assign(stepData, getDataVariableByStep(currentStep));
    if (currentStep > 2) {
        stepData = Object.assign(stepData, planData);
    }
    return stepData;
}

function setStepHtmlTemplate() {
    let indexCurrentStep = currentStep - 1;
    $(".l-list__item").eq(indexCurrentStep).addClass('is-active');
    const STEP_DATA = getStepData();
    console.log(STEP_DATA);
    $.ajax({
        url: 'php/get_template.php',
        type: 'POST',
        data: STEP_DATA,
        dataType: 'html',
        error: function () {
            // mostrarRespuesta('Ocurrió un error al editar la contraseña.', false);
        },
        success: function (htmlTemplate) {
            $('#card').html(htmlTemplate);
        }
    });
}

const MAP_PLAN_PRICES = new Map([
    ['arcade', { mo: 9, yr: 90 }],
    ['advanced', { mo: 12, yr: 120 }],
    ['pro', { mo: 15, yr: 150 }],
]);

let firstTemplate = 1;
let currentStep = firstTemplate;
let personalInfoData = {};
let typePlanSelected = 'monthly';
let planData = { plan_selected: null, type_plan_selected: typePlanSelected };
let addOnsData = { list_add_ons_selected: [] };
setStepHtmlTemplate();
