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
                        <v-card-title>
                            <h3>Manual TTS Message</h3>
                        </v-card-title>


                        <v-select
                            v-model="selectedVoice"
                            :items="voiceList"
                            label="Voice List"
                        ></v-select>

                        <v-textarea
                            v-model="message"
                            name="tts-message"
                            label="Message"
                            hint="Max 200 Characters"
                            @keypress.enter.prevent="speak"
                            rows="2"
                            autofocus=true
                            box
                        ></v-textarea>

                        <v-layout>
                            <v-spacer/>

                            <v-btn
                                color="#2196f3"
                                dark
                                @click="speak"
                            >
                                Read Message
                            </v-btn>
                        </v-layout>

                    </v-layout>
                </v-card-actions>

            </v-card>

            <Chat/>

        </v-flex>
    </v-layout>
</template>

<script>
    import Chat from '~/components/TTS/Chat'

    export default {
        name: 'tts',

        components: {
            Chat,
        },

        data() {
            return {
                isLoading: true,
                message: '',
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
                this.greetingSpeech.pitch = 1;
                this.greetingSpeech.rate = 1;
                this.synth.speak(this.greetingSpeech);
                this.message = '';
            }
        },

        computed: {},

        mounted() {
            if (process.server) return;

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
            };

            this.listenForSpeechEvents();
        }
    }
</script>
