$(document).ready(function() {
    // Discuss - 
    // i need the address of income and outcome dir to parse it to the Rest
    // i think we need 2 more calls to get the folders location
    // i need another call for getting the errors and files
    // from where to get list of organizations and their google urls for generic mapping?
    // generic transform using Google Sheet mapping WHAT IS mappingRange=A1:D
    // custom transform using Google Sheet mapping I THINK WE AGREED THIS TO BE WITH SELECTION FOR LOCAL MAPPING NOT GOOGLE ONE

    //GLOBAL VARS
    var submit_buttons = $('.submit');
    var loader = $('.loader');
    var loader_img = $('.loader_img');

    // dorpdowns   
    var organization_select = $('#organization');
    var file_type_select = $('#file_type');
    var transformation_type_select = $('#transformation_type');
    var mapping_type_select = $('#mapping_type');

    //buttons
    var mapping_location_btn_google = $('#mapping_location_btn_google');

    // REST urls
    var mapping_files_url = 'http://localhost:8080/rest/list-mapping-dir-contents';
    var output_dir_content_url = 'http://localhost:8080/rest/list-output-dir-contents';
    var input_dir_content_url = 'http://localhost:8080/rest/list-input-dir-contents';
    var xquery_files_url = 'http://localhost:8080/rest/list-xquery-dir-contents';


    // Common functions
    function disableSubmit() {
        $(submit_buttons).prop('disabled', true);
    }

    function enableSubmit() {
        $(submit_buttons).prop('disabled', false);
    }

    function showLoader() {
        // calculating the height of the main element and setting the loader same size
        var main_height = $('#main-inner').innerHeight();
        var img_margin = (main_height / 2) - 50;
        $(loader).css({
            'height': main_height + 'px'
        });
        // centering the loader gif
        $(loader_img).css({
            'margin-top': img_margin + 'px'
        });
        $(loader).show();
    }

    function hideLoader() {
        $(loader).hide();
    }

    // disable submit on page load
    disableSubmit();

    // listing the content of input and output folder
    function inputFolderListingContent(){

        $.get( input_dir_content_url, function( data ) {
            var input_dir_content = data;
            // if folder is not empty list all items in it
            $.each(input_dir_content.split("|"), function(index, item) {
                $('#income_folder').append('<tr><td>'+item+'</td></tr>');
            });
        });
    };

    function outputFolderListingContent() {
        $.get( output_dir_content_url, function( data ) {
            var output_dir_content = data;
            // if folder is not empty list all items in it
            $.each(output_dir_content.split("|"), function(index, item) {
                $('#outcome_folder').append('<tr><td>'+item+'</td></tr>');
            });
        });
    };

    //starting transformation
    function startTransformation (){

    //getting all the values of inputs
    var organizationVal = $('#organization').val()
    var fileTypeVal = $('#file_type').val();
    var transformationTypeVal = $('#transformation_type').val();
    var mappingTypeVal = $('#mapping_type').val();
    var googleLinkVal = $('#google_link').val();
    var specificMappingGoogleStepVal = $('#specific_mapping_google_step').val();
    var specificTransXsdVal = $('#specific_trans_xsd');
    var specificTransMapping = $('#specific_trans_mapping');

        /*
        create check so that we know if we will make
        1. EAD1-to-EAD2002 conversion: http://localhost:8080/rest/process?organisation=ontotext&fileType=xml&inputDir=/home/georgi/Downloads/test-conversion-input/&outputDir=/home/georgi/Downloads/test-conversion-output/
        2. generic transform using Google Sheet mapping: http://localhost:8080/rest/process?organisation=ontotext&fileType=xml&mapping=1H8bgPSWTvvfICZ6znvFpf4iDCib39KZ0jfgTYHmv5e0&mappingRange=A1:D&inputDir=/home/georgi/Downloads/test-input/&outputDir=/home/georgi/Downloads/test-output/
        3. generic transform using local Excel mapping: http://localhost:8080/rest/process?organisation=ontotext&fileType=xml&mapping=/home/georgi/Downloads/0-TEST-mapping-DO-NOT-MODIFY.xlsx&inputDir=/home/georgi/Downloads/test-input/&outputDir=/home/georgi/Downloads/test-output/
        4. custom transform using Google Sheet mapping: http://localhost:8080/rest/process?organisation=ontotext&fileType=xml&xquery=/home/georgi/Downloads/test.xqy&inputDir=/home/georgi/Downloads/test-input/&outputDir=/home/georgi/Downloads/test-output/
        */
        //1. EAD1-to-EAD2002
        if ($(fileTypeVal).val() === 'xml_ead'){
            var urlToBeSend = 'http://localhost:8080/rest/process?organisation='+organizationVal+'&fileType='+fileTypeVal+'&inputDir=D:/Projects/EHRI/ehri-conversion-tools/input';
        }

        //3. generic transform using local
        //2. generic transform using Google Sheet mapping:

        if ($(mappingTypeVal).val() === 'generic' && specificMappingGoogleStepVal != '') {
            console.log('if');
            var urlToBeSend = 'http://localhost:8080/rest/process?organisation='+organizationVal+'&fileType='+fileTypeVal+'&mapping='+specificMappingGoogleStepVal+'&inputDir=/D:/Projects/EHRI/ehri-conversion-tools/input/';
        } else if ($(mappingTypeVal).val() === 'generic' && specificMappingGoogleStepVal === ''){
            console.log('else if');
            var urlToBeSend = 'http://localhost:8080/rest/process?organisation='+organizationVal+'&fileType='+fileTypeVal+'&mapping='+googleLinkVal+'&mappingRange=A1:D&&inputDir=/D:/Projects/EHRI/ehri-conversion-tools/input&outputDir=/D:/Projects/EHRI/ehri-conversion-tools/output/';
        }

        //4 custom transform using Google Sheet mapping
        
        if ($(mappingTypeVal).val() === 'specific') {
            var urlToBeSend = 'http://localhost:8080/rest/process?organisation='+organizationVal+'&fileType='+fileTypeVal+'&xquery='+specificTransXsdVal+'&inputDir=/D:/Projects/EHRI/ehri-conversion-tools/input&outputDir=/D:/Projects/EHRI/ehri-conversion-tools/output/';
        }

        $.get( urlToBeSend, function( data ) {
            $('#step5').slideUp(300);
            $('#step6').slideDown(300);
            $('.active').removeClass('active');
            $('#label_step_6').addClass('active');
            hideLoader();
        });
    }


    // Check if organization is selected on change
    // Enable submit button
    $(organization_select).on('change', function() {
        var value_organization = this.value;
        if (value_organization != '') {
            enableSubmit();
        }
        
    });

    $('#submit_step1').click(function() {
        $('#step1').slideUp(300);
        $('#step2').slideDown(300);
        $('.active').removeClass('active');
        $('#label_step_2').addClass('active');
        disableSubmit();
    });

    // Check if file type is selected on change
    // Enable submit button
    $(file_type_select).on('change', function() {
        var value_file_type = this.value;
        if (value_file_type != '') {
            enableSubmit();
        }
    });

    $('#submit_step2').click(function() {
        $('#step2').slideUp(300)
        if ($('#file_type').val() === 'xml_ead') {
            $('#step2_1').slideDown(300);
            disableSubmit();
        } else {;
            $('#step3').slideDown(300);
            $('.active').removeClass('active');
            $('#label_step_3').addClass('active');
            disableSubmit();
        }
        disableSubmit();
    });

    $('#previous_step2').click(function() {
        $('.active').removeClass('active');
        $('#label_step_1').addClass('active');
        $('#step1').slideDown(300);
        $('#step2').slideUp(100);
        disableSubmit();
    });


    // Check if file type is selected on change
    // Enable submit button
    $(transformation_type_select).on('change', function() {
        var value_transformation_type_select = this.value;
        if (value_transformation_type_select != '') {
            enableSubmit();
        }
    });

    $('#submit_step2_1').click(function() {
        $('#step2_1').slideUp(300)
        if ($('#transformation_type').val() === 'ead_2') {
            $('#step5').slideDown(300);
            $('.active').removeClass('active');
            $('#label_step_5').addClass('active');
        } else if ($('#transformation_type').val() === 'mapping') {
            $('#step3').slideDown(300);
            $('.active').removeClass('active');
            $('#label_step_3').addClass('active');
        }
        disableSubmit();
    });

    $('#previous_step2_1').click(function() {
        $('.active').removeClass('active');
        $('#label_step_1').addClass('active');
        $('#step1').slideDown(300);
        $('#step2_1').slideUp(100);
        disableSubmit();
    });


    $(mapping_type_select).on('change', function() {
        var value_mapping_type_select = this.value;
        if (value_mapping_type_select != '') {
            enableSubmit();
        }
    });

    $('#submit_step3').click(function() {
        if ($('#mapping_type').val() === 'generic') {
            //add links from file that we will read if online
            if (navigator.onLine) {
                $('#step3').slideUp(300);
                $('#step4').slideDown(300);

            } else {
                $('#step3').slideUp(300);
                $('#step4').slideDown(300);
                $('#view_google').hide();
                $('#iframe_holder').hide();
            }
            //getting mapping files
            $.get( mapping_files_url, function( data ) {
                console.log( data );
                var mapping_files = data;

                $.each(mapping_files.split("|"), function(index, item) {
                    $('#specific_mapping_google_step').append('<option value="'+ item + '">'+item+'</option>');
                });
            });
        } else if ($('#mapping_type').val() === 'specific') {
            $('#step3').slideUp(300);
            $('#step4_1').slideDown(300);
            
   
            $.get( xquery_files_url, function( data ) {
                console.log( data );
                var xquery_files = data;

                $.each(xquery_files.split("|"), function(index, item) {
                    $('#specific_trans_xsd').append('<option value="'+ item + '">'+item+'</option>');
                });
            });
            $.get( mapping_files_url, function( data ) {
                console.log( data );
                var mapping_files = data;

                $.each(mapping_files.split("|"), function(index, item) {
                    $('#specific_trans_mapping').append('<option value="'+ item + '">'+item+'</option>');
                });
            });
        }
        $('.active').removeClass('active');
        $('#label_step_4').addClass('active');
        event.preventDefault();


    });

    $('#previous_step3').click(function() {
        $('.active').removeClass('active');
        $('#label_step_2').addClass('active');
        $('#step2').slideDown(300);
        $('#step3').slideUp(100);
        disableSubmit();
    });

    $('#submit_step4').click(function() {
        $('#step4').slideUp(300);
        $('#step5').slideDown(300);
        $('.active').removeClass('active');
        $('#label_step_5').addClass('active');

        disableSubmit();
        inputFolderListingContent();
        outputFolderListingContent();
    });

    $('#previous_step4').click(function() {
        $('.active').removeClass('active');
        $('#label_step_3').addClass('active');
        $('#step3').slideDown(300);
        $('#step4').slideUp(100);
        disableSubmit();
    });

    $('#submit_step4_1').click(function() {
        $('#step4_1').slideUp(300);
        $('#step5').slideDown(300);
        $('.active').removeClass('active');
        $('#label_step_5').addClass('active');

        disableSubmit();
        inputFolderListingContent();
        outputFolderListingContent();
    });

    $('#previous_step4').click(function() {
        $('.active').removeClass('active');
        $('#label_step_3').addClass('active');
        $('#step3').slideDown(300);
        $('#step4_1').slideUp(100);
        disableSubmit();
    });

    $('#submit_step5').click(function() {
        showLoader();

        startTransformation();
        // listing the content of input and output folder
        var input_files_count = 0;
        $.get( input_dir_content_url, function( data ) {
            var input_dir_content = data;
            // if folder is not empty list all items in it
            $.each(input_dir_content.split("|"), function(index, item) {
                input_files_count++;
            });
            $('#for_transformation_files').append(input_files_count);
        });

        var output_files_count = 0;
        $.get( output_dir_content_url, function( data ) {
            var output_dir_content = data;
            // if folder is not empty list all items in it
            $.each(output_dir_content.split("|"), function(index, item) {
                output_files_count++;
            });
            $('#transformed_files').append(output_files_count);
        });

    });

    $('#previous_step5').click(function() {
        $('.active').removeClass('active');
        $('#label_step_4').addClass('active');
        $('#step4').slideDown(300);
        $('#step5').slideUp(100);
        disableSubmit();
    });

    // transform step 6 to last step
    $('#submit_step6').click(function() {
        $('#step6').slideUp(300);
        $('#step7').slideDown(300);
        $('.active').removeClass('active');
        $('#label_step_7').addClass('active');
        return false;
    });

    $('#start_new').click(function() {
        $('#step7').slideUp(300);
        $('#step2').slideDown(300);
        $('.active').removeClass('active');
        $('#label_step_2').addClass('active');
        return false;
    });

    $('#repeat').click(function() {
        $('#step7').slideUp(300);
        $('#step5').slideDown(300);
        $('.active').removeClass('active');
        $('#label_step_5').addClass('active');
        return false;
    });


    /*
    $('#label_step_1').click(function() {
        $('.active').removeClass('active');
        $('#step1').slideDown(300);
        $(this).addClass('active');
        $('#step2, #step3, #step4, #step5, #step6').slideUp(100);
    });

    $('#label_step_2').click(function() {
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('#step2').slideDown(300);
        $('#step1, #step3, #step4, #step5, #step6').slideUp(100);
    });

    $('#label_step_3').click(function() {
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('#step3').slideDown(300);
        $('#step1, #step2, #step4, #step5, #step6').slideUp(100);
    });

    $('#label_step_4').click(function() {
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('#step4').slideDown(300);
        $('#step1, #step2, #step3, #step5, #step6').slideUp(100);
    });

    $('#label_step_5').click(function() {
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('#step5').slideDown(300);
        $('#step1, #step2, #step3, #step4, #step6').slideUp(100);
    });

    $('#label_step_6').click(function() {
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('#step6').slideDown(300);
        $('#step1, #step2, #step3, #step4, #step5').slideUp(100);
    });
    */
});