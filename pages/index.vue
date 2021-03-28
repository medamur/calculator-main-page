<template>
  <div>
    <h5>Дополнительно в начале страницы добавить любой текст, который будет отдаваться на уровне сервера nuxt.js</h5>
    <div style="display: flex">
      <div>
        <select v-model="from" v-if="cities" @change="getPrice">
          <option v-for="(el, idx) of cities" :key="idx" :value="el.guid">{{ el.name }}</option>
        </select>
        <div>
          <label>
            <input v-model="fromType" type="radio" value="address" @change="getPrice" />
            <span>От адреса</span>
          </label>

          <label>
            <input v-model="fromType" type="radio" value="terminal" @change="getPrice" />
            <span>От терминала</span>
          </label>

          <div>
            <span>Вес</span>
            <div>
              <input
                v-model="weight"
                type="number"
                placeholder="Вес"
                @input="() => validateWeight(false)"
                @blur="getPrice"
              />
            </div>
          </div>
        </div>
      </div>

      <div style="margin-left: 40px">
        <select v-model="to" v-if="cities" @change="getPrice">
          <option v-for="(el, idx) of cities" :key="idx" :value="el.guid">{{ el.name }}</option>
        </select>
        <div>
          <label>
            <input v-model="toType" type="radio" value="address" @change="getPrice" />
            <span>До адреса</span>
          </label>

          <label>
            <input v-model="toType" type="radio" value="terminal" @change="getPrice" />
            <span>До терминала</span>
          </label>

          <div>
            <span>Объём</span>
            <div>
              <input
                v-model="volume"
                type="number"
                placeholder="Объём"
                @input="() => validateVolume(false)"
                @blur="getPrice"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <!-- ----------output-------------- -->
    <div v-if="output">
      <div>{{ output.delivery }}</div>
      <div>{{ output.total }} ₽</div>
      <span style="text-decoration: line-through">{{ output.base }} ₽</span>
    </div>
    <!-- ----------output-------------- -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface IGetPrice {
  currency: 'RU'
  from: {
    guid: string
    type: string
  }
  to: {
    guid: string
    type: string
  }
  volume: string
  weight: string
}

export default Vue.extend({
  data: () => ({
    fromType: 'terminal',
    toType: 'terminal',
    cities: [],
    output: null,
    weight: 0.9,
    volume: 0.1,
    from: null,
    to: null
  }),
  async created() {
    if (!process.server) {
      try {
        const res = await this.$axios.get('/location/get')
        if (res?.data?.length) {
          if (!this.cities.length) {
            this.cities = res.data
          }
        }
      } catch (e) {}
    }
  },
  methods: {
    async getPrice() {
      this.validateWeight(true)
      this.validateVolume(true)

      if (this.from && this.to && this.weight && this.volume) {
        console.log('ready to send')

        const dataSend: IGetPrice = {
          currency: 'RU',
          from: {
            guid: String(this.from),
            type: this.fromType
          },
          to: {
            guid: String(this.to),
            type: this.toType
          },
          volume: String(this.volume),
          weight: String(this.weight)
        }

        try {
          const res = await this.$axios.post('/price/get', dataSend)
          if (res?.data) {
            this.output = res.data
          }
        } catch (e) {}
      } else {
        console.log('it is not ready to send')
      }
    },
    validateWeight(isCheckBlur: boolean): void {
      const valWeight: Number = Number(this.weight)

      if (valWeight === 0 && !isCheckBlur) return

      if (valWeight < 0.1) {
        this.weight = 0.1
      } else if (valWeight > 19999) {
        this.weight = 19999
      }
    },
    validateVolume(isCheckBlur: boolean): void {
      const valWeight: Number = Number(this.volume)

      if (valWeight === 0 && !isCheckBlur) return

      if (valWeight < 0.01) {
        this.volume = 0.01
      } else if (valWeight > 74) {
        this.volume = 74
      }
    }
  }
})
</script>
