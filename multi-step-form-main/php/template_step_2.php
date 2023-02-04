<?php

try {

    if ($_SERVER["REQUEST_METHOD"] != "GET") {
        echo "<div>Error: Request method</div>";
        return;
    }

    $step = $_GET['step'];
    if (!isset($step)) {
        echo 'Error: No step specified';
        return;
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

            default:
                $html_template = '';
                break;
        }
        return $html_template;
    }

    function get_html($step, $array_data) {
        $html = '<h1 class="c-card__title">' . $array_data['title'] . '</h1>';
        $html .= '<p class="c-card__paragraph">' . $array_data['paragraph'] . '</p>';
        $html .= get_html_template_by_step($step);
        return $html;
    }

    function get_html_form($html_body, $class, $id) {
        $html_form = '<form action="#" class="l-form ' . $class . '" id="' . $id . '">
        <div class="l-form__body">';
        $html_form .= $html_body;
        $html_form .= '</form>';
        return $html_form;
    }

    function get_template_step_two() {
        $containers_list = [
            ['icon' => 'icon-arcade.svg', 'title' => 'Arcade', 'price' => '', 'yearly_text' => 'e.g. Stephen King'],
            ['icon' => 'icon-advanced.svg', 'title' => 'Advanced', 'price' => '', 'yearly_text' => 'e.g. stephenking@lorem.com'],
            ['icon' => 'icon-pro.svg', 'title' => 'Pro', 'price' => '', 'yearly_text' => 'e.g. +1 234 567 890']
        ];
        $template = '';
        foreach ($containers_list as $container) {
            $template .= '<div class="c-container c-container--bordered c-container--plan" id="plan-arcade">
            <img class="c-container__icon" src="assets/images/icon-arcade.svg" alt="">
            <div class="c-texts c-texts--plan">
              <p class="c-texts__title">Arcade</p>
              <p class="c-texts__subtitle">$9/mo</p>
              <span class="c-texts__paragraph">2 months free</span>
            </div>
          </div>';
        }

        $template = get_html_form($template, 'l-form--full l-form--plan', 'card-plan');
        return $template;
    }

    function get_template_step_one() {
        $inputs_list = [
            ['label' => 'Name', 'type' => 'text', 'name' => 'name', 'placeholder' => 'e.g. Stephen King'],
            ['label' => 'Email Address', 'type' => 'email', 'name' => 'email_address', 'placeholder' => 'e.g. stephenking@lorem.com'],
            ['label' => 'Phone Number', 'type' => 'number', 'name' => 'phone_number', 'placeholder' => 'e.g. +1 234 567 890']
        ];
        $template = '';
        foreach ($inputs_list as $input) {
            $template .= '<div class="c-container c-container--personal-info">
            <label for="' . $input['name'] . '" class="c-container__label">' . $input['label'] . '</label>
            <input type="' . $input['type'] . '" placeholder="' . $input['placeholder'] . '" class="c-container__input" name="' . $input['name'] . '">
            </div>';
        }

        $template = get_html_form($template, 'l-form--personal-info', 'card-personal-info');
        return $template;
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
                'title' => 'Pick add-on',
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
    echo $html_template;
    // echo '<h1>Error<h1>';
} catch (\Throwable $th) {
    throw $th;
}
