<template>
    <v-layout

        grid-list-xl
        justify-center
    >

        <v-flex
            class="py-3"
            xs12
            sm10
            md8
        >

            <h3 class="title">Better Text To Speech</h3>

            <v-card
                class="my-3"
            >

                <v-card-actions>
                    <v-layout
                        column
                    >
                        <v-textarea
                            v-model="message"
                            name="tts-message"
                            label="Message"
                            hint="Max 200 Characters"
                            @keypress.enter.prevent="speak"
                        ></v-textarea>

                        <v-select
                            v-model="selectedVoice"
                            :items="voiceList"
                            label="Voice List"
                        ></v-select>

                        <v-btn
                            class="my-2"
                            color="#2196f3"
                            dark
                            @click="speak"
                        >
                            Play Text To Speech
                        </v-btn>
                    </v-layout>
                </v-card-actions>

            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: 'tts',

        data() {
            return {
                isLoading: true,
                message: 'This is a test of the new text to speech.',
                selectedVoice: 3,
                synth: null,
                voiceList: [],
                voices: [],
                greetingSpeech: null,
            }
        },

        methods: {
            /**
             * React to speech events
             */
            listenForSpeechEvents () {
                this.greetingSpeech.onstart = () => this.isLoading = true;
                this.greetingSpeech.onend   = () => this.isLoading = false;
            },

            /**
             * Shout at the user
             */
            speak () {
                this.greetingSpeech.text = this.message;

                this.greetingSpeech.voice = this.voices[this.selectedVoice];

                this.synth.speak(this.greetingSpeech);

                this.message = '';
            }
        },

        computed: {},

        mounted() {
            this.synth = window.speechSynthesis;
            this.greetingSpeech = new window.SpeechSynthesisUtterance();

            this.voiceList = this.synth.getVoices();

            if (this.voiceList.length) this.isLoading = false;

            this.synth.onvoiceschanged = () => {
                const voices = this.synth.getVoices();
                this.voices = voices;
                for (let i=0,max=voices.length; i<max; i++) {
                    this.voiceList.push({
                        text: `${voices[i].name} (${voices[i].lang})`,
                        value: i,
                    });
                }


                // give a bit of delay to show loading screen
                // just for the sake of it, I suppose. Not the best reason
                setTimeout(() => this.isLoading = false, 800);
            };

            this.listenForSpeechEvents();
        }
    }
</script>
