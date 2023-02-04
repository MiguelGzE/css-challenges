<?php

function get_step_template() {
    $name_value = isset($_POST['name']) ? $_POST['name'] : '';
    $email_value = isset($_POST['email_address']) ? $_POST['email_address'] : '';
    $phone_value = isset($_POST['phone_number']) ? $_POST['phone_number'] : '';

    $inputs_list = [
        ['label' => 'Name', 'type' => 'text', 'name' => 'name', 'value' => $name_value, 'placeholder' => 'e.g. Stephen King'],
        ['label' => 'Email Address', 'type' => 'email', 'name' => 'email_address', 'value' => $email_value, 'placeholder' => 'e.g. stephenking@lorem.com'],
        ['label' => 'Phone Number', 'type' => 'number', 'name' => 'phone_number', 'value' => $phone_value, 'placeholder' => 'e.g. +1 234 567 890']
    ];

    $template = '';?>
    
        <div class="c-container c-container--personal-info">
            <label for="name" class="c-container__label">Name</label>
            <input type="text" placeholder="e.g. Stephen King" class="c-container__input" name="name">
        </div>
        <div class="c-container c-container--personal-info">
            <label for="email_address" class="c-container__label">Email Address</label>
            <input type="email" placeholder="e.g. stephenking@lorem.com" class="c-container__input"
              name="email_address">
        </div>
        <div class="c-container c-container--personal-info">
            <label for="phone_number" class="c-container__label">Phone Number</label>
            <input type="number" placeholder="e.g. +1 234 567 890" class="c-container__input" name="phone_number">
        </div>
    <?php
    // foreach ($inputs_list as $input) {
    //     $template .= '<div class="c-container c-container--personal-info">
    //         <label for="' . $input['name'] . '" class="c-container__label">' . $input['label'] . '</label>
    //         <input type="' . $input['type'] . '" placeholder="' . $input['placeholder'] . '" class="c-container__input" name="' . $input['name'] . '">
    //         </div>';
    // }
    // $template = get_html_form($template, 'l-form--personal-info');
    // return $template;
}


// $html_template = '';
// $array_data = get_array_data_by_step($step);
// $html_template .= get_html($step, $array_data);
// echo $html_template;
