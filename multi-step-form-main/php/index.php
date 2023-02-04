<?php

try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        echo "<div>Error: Request method</div>";
        return;
    }

    $step = $_POST['step'];
    if (!isset($step)) {
        echo 'Error: No step specified';
        return;
    }

    $step = intval($step);

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

    include "template_step_$step.php";

    $template = get_step_template();
    echo $template;
} catch (\Throwable $th) {
    throw $th;
}
