<template>
  <div>
    <v-app>
      <v-main>
        <v-container class="container pa-0 ma-0" fluid>
          <v-tabs v-model="tab" color="blue" bg-color="grey-lighten-3" grow>
            <v-tab value="backend">
              Back End Demo
            </v-tab>
            <v-tab value="frontend">
              Front End Demo
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item value="backend">
              <v-container class="container pa-0 ma-0">
                <v-row>
                  <v-col class="header pa-0">
                    TASHA Backend Demo
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="subheader pa-0">
                    Team Atlas | Google Solution Challenge 2023
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="card pa-0" cols="12" sm="6" md="4">
                    <v-card class="card-body" color="#F1F1F1">
                      <v-card-title>
                        <h2 class="mt-4">Instructions</h2>
                      </v-card-title>
                      <v-card-text>
                        <p class="my-2">1. Open the chat window in the bottom right corner.</p>
                        <p class="my-2">2. Begin with a greeting.</p>
                        <p class="my-2">3. Share your feelings or ask for some tips.</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn class="slides-btn" variant="tonal" color="blue"
                      href="https://drive.google.com/file/d/1VC5ALps4_-_K9lX_1OhhcAmdE6Kni7wb/view?usp=sharing"
                      target="_blank"> Optional Feasibility Study Slides</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <df-messenger df-cx="true" location="northamerica-northeast1" chat-title="ATLAS-1"
                      agent-id="88847fff-0a7e-4a92-93ba-a0e36d84ada8" language-code="en"></df-messenger>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <v-window-item value="frontend">
              <v-row>
                <v-col class="pa-0" cols="12" sm="11" md="11">
                  <v-carousel class="carousel pa-0 " height="auto" width="auto" show-arrows="hover" hide-delimiters
                    progress="primary">
                    <v-carousel-item src="https://storage.googleapis.com/frontend-imgs/front1.png" cover eager></v-carousel-item>
                    <v-carousel-item src="https://storage.googleapis.com/frontend-imgs/front2.png" cover eager></v-carousel-item>
                    <v-carousel-item src="https://storage.googleapis.com/frontend-imgs/front3.png" cover eager></v-carousel-item>
                    <v-carousel-item src="https://storage.googleapis.com/frontend-imgs/front4.png" cover eager></v-carousel-item>
                    <v-carousel-item src="https://storage.googleapis.com/frontend-imgs/front5.png" cover eager></v-carousel-item>
                  </v-carousel>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'App',
  data: () => ({
    tab: null,
  }),
  setup() {
    onMounted(() => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger-cx/bootstrap.js?v=1';
      document.body.appendChild(script);
    });

    return {};
  },
};
</script>

<style>
.container {
  max-width: none;
  padding: 0;
}

.header {
  margin-left: 50px;
  margin-top: 30px;
  font-size: 30px;
  font-weight: bold;
  padding: 0;
}

.subheader {
  margin-left: 50px;
  margin-top: 10px;
  font-size: 20px;
  font-weight: normal;
  padding: 0;
}

.card {
  margin-left: 50px;
  margin-top: 30px;
  padding: 0;
}

.card-body {
  background-color: lightblue;
  box-shadow: 0px 0px 5px #bbb;
  width: 400px;
  height: 200px;
  float: left;
  padding: 0;
}

.carousel {
  margin-left: 50px;
  margin-top: 30px;
  padding: 0;
  float: left;
}

.slides-btn {
  margin-top: 15px;
  margin-left: 40px;
  padding: 0;
  float: left;
}
</style>
