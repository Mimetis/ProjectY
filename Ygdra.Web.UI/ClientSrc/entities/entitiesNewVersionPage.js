// @ts-check

export class entitiesNewVersionPage {

    constructor() {

    }


    async onLoad() {

        $("input[type='number']").inputSpinner();

        // get wizard
        this.$smartWizard = $("#smartWizard");


        // bootstrap wizard
        this.$smartWizard.smartWizard({
            selected: 0,
            theme: 'default', // theme for the wizard, related css need to include for other than default theme
            autoAdjustHeight: false,
            justified: false,
            transition: {
                animation: 'fade', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                speed: '200', // Transion animation speed
                easing: '' // Transition animation easing. Not supported without a jQuery easing plugin
            },
            enableURLhash: false,
            toolbarSettings: {
                toolbarPosition: 'none', // none, top, bottom, both
                toolbarButtonPosition: 'right', // left, right, center
                showNextButton: false, // show/hide a Next button
                showPreviousButton: false, // show/hide a Previous button
                toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
            },
            anchorSettings: {
                anchorClickable: true, // Enable/Disable anchor navigation
                enableAllAnchors: true, // Activates all anchors clickable all times
                markDoneStep: true, // Add done state on navigation
                markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
                removeDoneStepOnNavigateBack: false, // While navigate back done step after active step will be cleared
                enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
            },
            keyboardSettings: {
                keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            },
        });
    }


    async onUnLoad() {

    }
}