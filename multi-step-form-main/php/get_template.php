<?php

try {

    header("Access-Control-Allow-Origin: *");
    // header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
    header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
    header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        echo "<div>Error: Request method</div>";
        return;
    }

    $step = $_POST['step'];
    if (!isset($step)) {
        echo 'Error: No step specified';
        return;
    }

    function get_html_form($html_body, $class, $id, $html__footer = null) {
        $html_form = '<form action="#" class="l-form ' . $class . '" id="' . $id . '">
            <div class="l-form__body">';
        $html_form .= $html_body;
        $html_form .= '</div>';
        if (isset($html__footer)) {
            $html_form .= '<div class="l-form__footer">';
            $html_form .= $html__footer;
            $html_form .= '</div>';
        }
        $html_form .= '</form>';
        return $html_form;
    }

    function get_list_add_ons_selected() {
        $list_add_ons_selected = isset($_POST['list_add_ons_selected']) ? $_POST['list_add_ons_selected'] : [];
        return $list_add_ons_selected;
    }

    function get_list_add_ons() {
        $list_add_ons = [
            'online-service' => ['title' => 'Online service', 'text' => 'Access to multiplayer games', 'price_monthly' => 1],
            'larger-storage' => ['title' => 'Larger storage', 'text' => 'Extra 1TB of cloud save', 'price_monthly' => 2],
            'customizable-profile' => ['title' => 'Customizable profile', 'text' => 'Custom theme on your profile', 'price_monthly' => 2]
        ];
        return $list_add_ons;
    }

    function get_is_yearly_plan() {
        return (isset($_POST['type_plan_selected']) && $_POST['type_plan_selected'] == 'yearly') ? true : false;
    }

    function get_plan_price_string($price, $is_yearly_plan) {
        $type = $is_yearly_plan ? 'yr' : 'mo';
        return '$' . $price . '/' . $type;
    }

    function get_plan_price($price_monthly) {
        $is_yearly_plan = get_is_yearly_plan();
        $plan_price = ['price' => $price_monthly, 'price_string' => get_plan_price_string($price_monthly, $is_yearly_plan)];
        if (!$is_yearly_plan) {
            return $plan_price;
        }

        $amount_months_to_be_paid_per_year = 10;
        $plan_price['price'] = $price_monthly * $amount_months_to_be_paid_per_year;
        $plan_price['price_string'] = get_plan_price_string($plan_price['price'], $is_yearly_plan);
        return $plan_price;
    }

    function get_data_selected_plan($plan_id) {
        $list_plans = get_list_plans();
        return $list_plans[$plan_id];
    }

    function get_list_plans() {
        $list_plans = [
            'arcade' => ['icon' => 'icon-arcade.svg', 'title' => 'Arcade', 'price_monthly' => 9],
            'advanced' => ['icon' => 'icon-advanced.svg', 'title' => 'Advanced', 'price_monthly' => 12],
            'pro' => ['icon' => 'icon-pro.svg', 'title' => 'Pro', 'price_monthly' => 15]
        ];
        return $list_plans;
    }

    function get_template_step_five() {
        $template = '<div class="c-container c-container--thank-you" id="thank-you">
            <img class="c-container__icon" src="assets/images/icon-thank-you.svg" alt="">
            <div class="c-texts c-texts--thank-you">
            <h1 class="c-card__title">Thank you!</h1>
            <p class="c-card__paragraph">Thanks for confirming your subscription! We hope you have fun
                using our platform. If you ever need support, please feel free
                to email us at support@loremgaming.com.</p>
            </div>
        </div>';
        return $template;
    }

    function get_template_step_four() {
        $is_yearly_plan = get_is_yearly_plan();
        $plan_selected = get_data_selected_plan($_POST['plan_selected']);

        $titles_by_type_plan_selected = $is_yearly_plan ?
            ['title' => 'Yearly', 'title_footer' => 'year'] : ['title' => 'Monthly', 'title_footer' => 'month'];
        $title = $plan_selected['title'] . ' (' . $titles_by_type_plan_selected['title'] . ')';
        $finish_up_price_data = get_plan_price($plan_selected['price_monthly']);
        $template = '<div class="c-container c-container--summary" id="summary">
            <div class="c-container">
              <div class="c-texts c-texts--titles">
                <p class="c-texts__title">' . $title . '</p>
                <a href="javascript:void(0)" class="c-texts__subtitle">Change</a>
              </div>
              <div class="c-texts c-texts--titles">
                <p class="c-texts__title">' . $finish_up_price_data['price_string'] . '</p>
              </div>
            </div>';

        $price_total = $finish_up_price_data['price'];
        $list_add_ons = get_list_add_ons();
        $list_add_ons_selected = get_list_add_ons_selected();
        if (count($list_add_ons_selected) > 0) {
            $template .= '<div class="c-line"></div><ul class="l-list l-list--summary">';
            foreach ($list_add_ons_selected as $add_on_selected) {
                $add_on_data = $list_add_ons[$add_on_selected];
                $add_on_price = get_plan_price($add_on_data['price_monthly']);
                $price_total += $add_on_price['price'];
                $template .= '<li class="l-list__item">
                <div class="c-texts c-texts--summary">
                  <p class="c-texts__title">' . $add_on_data['title'] . '</p>
                  <p class="c-texts__subtitle">+' . $add_on_price['price_string'] . '</p>
                </div>
              </li>';
            }
            $template .= '</ul></div>';
        }

        $price_total_string = get_plan_price_string($price_total, $is_yearly_plan);
        $footer_template = '<div class="l-form__footer">
            <div class="c-texts c-texts--summary">
            <p class="c-texts__title">Total (per ' . $titles_by_type_plan_selected['title_footer'] . ')</p>
            <p class="c-texts__text c-texts__text--price">+' . $price_total_string . '</p>
            </div>
        </div>';
        $template = get_html_form($template, 'l-form--full', 'card-summary', $footer_template);
        return $template;
    }

    function get_template_step_three() {
        $list_add_ons = get_list_add_ons();
        $list_add_ons_selected = get_list_add_ons_selected();
        $template = '';
        foreach ($list_add_ons as $add_on_id => $add_on) {
            $class_is_selected = count($list_add_ons_selected) > 0 && in_array($add_on_id, $list_add_ons_selected) ? ' is-selected' : '';
            $add_on_price = get_plan_price($add_on['price_monthly']);
            $template .= '<div class="c-container c-container--bordered c-container--add-on' . $class_is_selected . '" id="add-on-' . $add_on_id . '">
                <div class="c-checkbox c-container-icon"></div>
                <div class="c-texts c-texts--add-on">
                    <p class="c-texts__title">' . $add_on['title'] . '</p>
                    <p class="c-texts__subtitle">' . $add_on['text'] . '</p>
                </div>
                <div class="c-texts c-texts--add-on">
                    <p class="c-texts__text">+' . $add_on_price['price_string'] . '</p>
                </div>
            </div>';
        }
        $template = get_html_form($template, 'l-form--add-on', 'card-pick-add-on');
        return $template;
    }

    function get_template_step_two() {
        $list_plans = get_list_plans();
        $yearly_text = '2 months free';
        $is_yearly_plan = get_is_yearly_plan();
        $plan_selected = isset($_POST['plan_selected']) ? $_POST['plan_selected'] : null;
        $template = '';
        foreach ($list_plans as $plan_id => $plan) {
            $class_is_selected = isset($plan_selected) && $plan_selected === $plan_id ? ' is-selected' : '';
            $plan_price = get_plan_price($plan['price_monthly']);
            $template .= '<div class="c-container c-container--bordered c-container--plan' . $class_is_selected . '" id="plan-' . $plan_id . '">
                <img class="c-container__icon" src="assets/images/' . $plan['icon'] . '" alt="' . $plan['title'] . '">
                <div class="c-texts c-texts--plan">
                    <p class="c-texts__title">' . $plan['title'] . '</p>
                    <p class="c-texts__subtitle">' . $plan_price['price_string'] . '</p>
                    <span class="c-texts__paragraph">' . $yearly_text . '</span>
                </div>
            </div>';
        }

        $checkbox_select_plan = $is_yearly_plan ? 'checked=checked' : '';
        $footer_template = '<div class="c-container c-container--select-plan">
            <span class="c-container__title">Monthly</span>
            <label class="c-switch">
                <input class="c-switch__checkbox" id="checkbox-plan" type="checkbox" ' . $checkbox_select_plan . '">
                <span class="c-switch__slider round"></span>
            </label>
            <span class="c-container__title--muted">Yearly</span>
        </div>';
        $class_string = 'l-form--full l-form--plan' . ($is_yearly_plan ? ' is-yearly-plan' : '');
        $template = get_html_form($template, $class_string, 'card-plan', $footer_template);
        return $template;
    }

    function get_template_step_one() {
        $name_value = isset($_POST['name']) ? $_POST['name'] : '';
        $email_value = isset($_POST['email_address']) ? $_POST['email_address'] : '';
        $phone_value = isset($_POST['phone_number']) ? $_POST['phone_number'] : '';

        $inputs_list = [
            ['label' => 'Name', 'type' => 'text', 'name' => 'name', 'value' => $name_value, 'placeholder' => 'e.g. Stephen King'],
            ['label' => 'Email Address', 'type' => 'email', 'name' => 'email_address', 'value' => $email_value, 'placeholder' => 'e.g. stephenking@lorem.com'],
            ['label' => 'Phone Number', 'type' => 'text', 'name' => 'phone_number', 'value' => $phone_value, 'placeholder' => 'e.g. +1 234 567 890']
        ];

        $template = '';
        foreach ($inputs_list as $input) {
            $template .= '<div class="c-container c-container--personal-info">
            <label for="' . $input['name'] . '" class="c-container__label">' . $input['label'] . '</label>
            <input type="' . $input['type'] . '" value="' . $input['value'] . '" placeholder="' . $input['placeholder'] . '" class="c-container__input" name="' . $input['name'] . '">
            <span class="c-is-invalid">This file is required</span>
            </div>';
        }

        $template = get_html_form($template, 'l-form--personal-info', 'card-personal-info');
        return $template;
    }

    function get_html_template_by_step($step) {
        $html_template = '';
        switch ($step) {
            case 1:
                $html_template = get_template_step_one();
                break;
            case 2:
                $html_template = get_template_step_two();
                break;
            case 3:
                $html_template = get_template_step_three();
                break;
            case 4:
                $html_template = get_template_step_four();
                break;
            case 5:
                $html_template = get_template_step_five();
                break;
            default:
                $html_template = '';
                break;
        }
        return $html_template;
    }

    function get_html($step, $array_data) {
        $html = '';
        if ($step < 5) {
            $html .= '<h1 class="c-card__title">' . $array_data['title'] . '</h1>';
            $html .= '<p class="c-card__paragraph">' . $array_data['paragraph'] . '</p>';
        }
        $html .= get_html_template_by_step($step);
        return $html;
    }

    function get_array_data_by_step($step) {
        $array_data = [
            1 => [
                'title' => 'Personal info',
                'paragraph' => 'Please provide your name, email address, and phone number.',
            ],
            2 => [
                'title' => 'Select your plan',
                'paragraph' => 'You have the option of monthly or yearly billing.'
            ],
            3 => [
                'title' => 'Pick add-ons',
                'paragraph' => 'Add-ons help enhance your gaming experience.'
            ],
            4 => [
                'title' => 'Finishing up',
                'paragraph' => 'Double-check everything looks OK before confirming.'
            ],
            5 => [
                'title' => '',
                'paragraph' => ''
            ]
        ];
        return $array_data[$step];
    }

    $step = intval($step);
    $html_template = '';
    $array_data = get_array_data_by_step($step);
    $html_template .= get_html($step, $array_data);

    // $response = ['step' => $step, 'html_template' => $html_template];
    // echo json_encode($response);
    echo $html_template;
    // echo '<h1>Error<h1>';
} catch (\Throwable $th) {
    throw $th;
}
