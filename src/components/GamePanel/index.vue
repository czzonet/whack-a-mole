<template>
  <div class="game">
    <h1>Whack A Mole</h1>
    <h2>Rules:</h2>

    <ul>
      <li>moles are orange. click them to whack them</li>
      <li>if you whack all the moles you win</li>
    </ul>

    <div>
      <div v-if="won()">
        <div class="success">YOU WON!</div>
      </div>
      <div v-else>
        <table>
          <tr v-for="(array,xCoord) in moleGrid" :key="xCoord">
            <td v-for="(value,yCoord) in array" :key="yCoord">
              <div
                class="circle"
                @click="squash(xCoord,yCoord)"
                :style="{background:value?'orange':'black'}"
              ></div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** vue */
import Vue from "vue";
/** lib */
import { getRandomInt } from "@/lib/random_int";

export default Vue.extend({
  name: "GamePanel",
  data() {
    return {
      moleGrid: [
        [0, 1, 0],
        [0, 0, 0],
        [1, 0, 0]
      ],
      hasWon: false
    };
  },
  methods: {
    /** 改动坐标点 需要保持追踪 */
    setMole(xCoord: number, yCoord: number, value: number) {
      let copyValue = [[]] as number[][];
      copyValue = JSON.parse(JSON.stringify(this.moleGrid));
      copyValue[xCoord][yCoord] = value;
      /** 数组改动的赋值方式 */
      this.moleGrid.splice(0, this.moleGrid.length, ...copyValue);
    },
    /** 打地鼠 */
    squash(xCoord: number, yCoord: number) {
      this.setMole(xCoord, yCoord, 0);
    },
    /** 新地鼠 */
    generateMole() {
      this.setMole(
        getRandomInt(0, this.moleGrid.length),
        getRandomInt(0, this.moleGrid[0].length),
        1
      );
    },
    won() {
      if (this.hasWon) {
        return true;
      } else {
        let sum = 0;
        for (let i = 0; i < this.moleGrid.length; i++) {
          const element = this.moleGrid[i];

          for (let j = 0; j < element.length; j++) {
            const unit = element[j];
            sum += unit;
          }
        }

        if (sum == 0) {
          this.hasWon = true;
        }

        return this.hasWon;
      }
    }
  },
  mounted() {
    setInterval(() => {
      console.log(this.won());
      this.generateMole();
    }, 1000);
  }
});
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.success {
  color: orange;
  font-weight: 700;
  margin-bottom: 0.5em;
  margin-top: 1.35em;
  line-height: 1.15em;
}

.circle {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>