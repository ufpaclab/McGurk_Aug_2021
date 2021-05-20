function ExampleExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // generate a random subject ID with 15 characters
	var subject_id = jsPsych.randomization.randomID(6);
 	const SONA_URL = `https://ufl.sona-systems.com/webstudy_credit.aspx?experiment_id=141&credit_token=bf40955791c84273b997a045a754768f&survey_code=${survey_code}`
	// record the condition assignment in the jsPsych data
	// this adds a property called 'subject' and a property called 'condition' to every trial
	jsPsych.data.addProperties({
  		subject: subject_id,
	});

	/* define welcome message trial */	
	var welcome = {
  		type: "html-keyboard-response",
  		stimulus: "Welcome to the experiment. Press any key to begin."
	};
	   
    // sample function that might be used to check if a subject has given
    // consent to participate.
    var check_consent = function(elem) {
      if (document.getElementById('consent_checkbox').checked) {
        return true;
      }
      else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
        return false;
      }
      return false;
    };


    // declare the block.
    var trial = {
      type:'external-html',
      url: "resources/Consent.html",
      cont_btn: "consent-button"
      //check_fn: check_consent
    };
  
  	var instructions = {
		type: 'image-keyboard-response',
        stimulus: ['https://victoria0527.github.io/jsPsychSheet/experiment/armsLength.png'],
		prompt: "<p> </p><p>Please sit roughly an arm’s length away from the screen as seen in the image. Please maintain eye contact with the screen while each video is being presented. Press any key to continue.</p>"
	};
    
	var cameraInit = {
		type: 'webgazer-init-camera',
		instructions: `<p>The <b>ONLY</b> webcam data collected is the point on the screen you are looking at. No images or recordings will ever leave your computer.</p>
		<p>Position your head so that the webcam has a good view of your eyes.</p>
		<p>Use the video in the upper-left corner as a guide. Center your face in the box and look directly towards the camera.</p>
		<p>It is important that you try and keep your head reasonably still throughout the experiment, so please take a moment to adjust your setup as needed.</p>
		<p>When your face is centered in the box and the box turns green, you can click to continue.</p>`
	};

	var cameraCalibrateInstructions = {
		type: 'html-keyboard-response',
		stimulus:`
				<p>The following event will calibrate our eyetracking. Please focus on dots as they appear, and then left-click each one with your mouse.</p>
				<p>Press any key to begin.</p>
		`
	}

	var cameraCalibrate = {
		type: 'webgazer-calibrate',
		calibration_points: [[25,50], [50,50], [75,50], [50,25], [50,75]],
		calibration_mode: 'click'
	}

	var cameraValidationInstructions = {
		type: 'html-keyboard-response',
		stimulus:`
				<p>The following event will test the accuracy of our eye tracking. Please focus on the black dots as they appear.</p>
				<p>Press any key to begin.</p>
		`
	}
	
	var cameraValidation = {
		type: 'webgazer-validate',
		validation_points: [[-200,-200], [-200,200], [200,-200], [200,200]],
		validation_point_coordinates: 'center-offset-pixels',
	}

    var briefing = {
      type: "html-keyboard-response",
      stimulus: "Before we begin, we would like to ask you a few questions.<br><br>" +
      "Press any key to continue."
    };

    var sex = {
      type: 'survey-multi-choice',
      questions: [
        {prompt: "What sex were you assigned at birth, on your original birth certificate?",
        name: 'sex', options: ['Female', 'Male', 'Prefer not to respond'], required:true}
      ],
    };

    var age = {
      type: 'survey-text',
      questions: [
        {prompt: "How old are you?", name: 'Age'}
      ],
    };
    
   var pre_if_trial = {
     timeline: [{
      type: 'video-button-response',
      stimulus: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryTaVisualGa.mp4'],
      width: 800,
      prompt: 'Please plug in headphones/turn on your speakers, and adjust the volume to a comfortable level. Feel free to replay this video as you adjust the volume, or press continue.',
      choices: ['Repeat','Continue']
     }],
     
    loop_function: function(data){
      if(data.values()[0].response == 0){
        return true;
      } else {
            return false;
       }
     }
   };

	var directions = {
  		type: "html-keyboard-response",
  		stimulus: "You will now be shown test videos to get you used to the experimental procedures. Press any key to continue."
	};
    
    /* Present a randomized order of all of the videos/trials you wish to show */
    /* Make sure the answer choices are contingent on the video */
    /* The answer choices are mainly from Table 1 in Stropahl et al., 2017 */
    /* We'll have to decide which options to give for the ones that aren't from that table */
    /* To learn more, check out https://www.jspsych.org/overview/timeline/#timeline-variables */
    
    
    var mcGurkProcedure1 = {
		timeline: [
			{
				type: 'video-button-response',
				stimulus: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>',
				extensions: [
					{
							type: 'webgazer',
							params: {
									targets: ['.jspsych-content-wrapper']
							}
					}
				],
			},
			{
				type: 'video-button-response',
				stimulus: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
				require_movement: true
			}
		],
		timeline_variables: [
            { video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Pa','Ga','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryDaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Ga','Da'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Pa','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na','Da','Ka','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ta','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Na','Ka','Ta'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryTaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ta','Ga','Ka','Da'],1) },
			
		],
		randomize_order: true,
		repetitions: 1
	}
    
    var ending = {
		type: "html-keyboard-response",
		stimulus: "Great job on the pretrials! Please get ready for the real experiment to begin. The experiment will take just under 30 minutes. You will be given a break between each segment. Press any key to continue."
	};
    
	var mcGurkProcedure2 = {
		timeline: [
			{
				type: 'video-button-response',
				stimulus: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>',
				extensions: [
					{
							type: 'webgazer',
							params: {
									targets: ['.jspsych-content-wrapper']
							}
					}
				],
				
			},
			{
				type: 'video-button-response',
				stimulus: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
				require_movement: true
			}
		],
		timeline_variables: [
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Pa','Ga','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryDaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Ga','Da'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Pa','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na','Da','Ka','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ta','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Na','Ka','Ta'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryTaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ta','Ga','Ka','Da'],1) },
			
		],
		randomize_order: true,
    	repetitions: 5
	}
    
    var rest = {
		type: "html-keyboard-response",
		stimulus: "You will now have a short break to rest your eyes, use the restroom, etc. There is no time limit. When you are ready, press any key to continue."
	};
    
	var mcGurkProcedure3 = {
		timeline: [
			{
				type: 'video-button-response',
				stimulus: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>',
				extensions: [
					{
							type: 'webgazer',
							params: {
									targets: ['.jspsych-content-wrapper']
							}
					}
				],
				
			},
			{
				type: 'video-button-response',
				stimulus: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
				require_movement: true
			}
		],
		timeline_variables: [
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Pa','Ga','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryDaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Ga','Da'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Pa','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na','Da','Ka','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ta','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Na','Ka','Ta'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryTaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ta','Ga','Ka','Da'],1) },
			
		],
		randomize_order: true,
    	repetitions: 5
	}
    
    var rest2 = {
		type: "html-keyboard-response",
		stimulus: "You will now have a short break to rest your eyes, use the restroom, etc. There is no time limit. When you are ready, press any key to continue."
	};
    
	var mcGurkProcedure4 = {
		timeline: [
			{
				type: 'video-button-response',
				stimulus: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>',
				extensions: [
					{
							type: 'webgazer',
							params: {
									targets: ['.jspsych-content-wrapper']
							}
					}
				],
				
			},
			{
				type: 'video-button-response',
				stimulus: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
				require_movement: true
			}
		],
		timeline_variables: [
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Pa','Ga','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryDaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Ga','Da'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryMaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Pa','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na','Da','Ka','Ma'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ta','Ga','Ba'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryPaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Na','Ka','Ta'],1) },
			{ video: ['https://victoria0527.github.io/jsPsychSheet/experiment/video/AuditoryTaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ta','Ga','Ka','Da'],1) },
			
		],
		randomize_order: true,
    	repetitions: 5
	}

    var goodbye = {
		type: "html-keyboard-response",
		stimulus: "Congratulations, the experiment is now over. Please do not close your window until it says that the data has finished uploading on the next screen, and check SONA when you are done!  If you DIDN'T receive credit after pushing the right arrow, please contact us at victoriacardenas@ufl.edu."
	};
	

	/* start the experiment */
	jsPsych.init({
		timeline: [
			welcome,
			trial,
			instructions,
			cameraInit,
			briefing,
			sex,
			age,
			pre_if_trial,
			directions,
			mcGurkProcedure1,
			ending,
			cameraCalibrateInstructions, cameraCalibrate, cameraValidationInstructions, cameraValidation,
			mcGurkProcedure2,
			rest,
			cameraCalibrateInstructions, cameraCalibrate, cameraValidationInstructions, cameraValidation,
			mcGurkProcedure3,
			rest2,
			cameraCalibrateInstructions, cameraCalibrate, cameraValidationInstructions, cameraValidation,
			mcGurkProcedure4,
			goodbye,
		],
		show_progress_bar: true,
		on_trial_finish: session.insert,
		on_finish: function() { window.top.location.href = SONA_URL },
		extensions: [
			{
					type: 'webgazer', 
					params: {
							sampling_interval: 100,
					}
			}
		]
	});
    }
}
