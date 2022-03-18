<template>
  <div>
    <select
      class="form-select mb-3"
      aria-label="Default select example"
      v-model="currency"
    >
      <option v-for="item in currencies" :key="item.code" :value="item">
        {{ item.name }}
      </option>
    </select>
    <div class="mb-3">
      <button
        v-for="(preset, index) in currencyPreset"
        :key="index"
        @click="selectPreset(preset, currency)"
        class="btn"
        :class="index === selectedDonationIndex ? 'btn-primary' : 'btn-light'"
      >
        {{ `${currency.symbol} ${formatNumber(preset)}` }}
      </button>
    </div>
    <div class="mb-3">
      <input
        type="number"
        v-model="donation"
        min="1"
        required
        class="form-control"
        @keydown="checkKey($event)"
      />
      <button @click="donate" class="btn btn-primary ml-3">Donate</button>
    </div>
  </div>
</template>

<script>
import { presets, suggestion, currencies } from "@/assets/data";
import axios from "axios";

export default {
  name: "Donation",
  data() {
    return {
      currencies,
      donation: suggestion,
      currency: currencies[0],
      selectedDonationIndex: 0,
    };
  },
  computed: {
    currencyPreset() {
      return presets.map((preset) =>
        this.countBeautiful(preset, this.currency)
      );
    },
  },
  watch: {
    currency(newValue, old) {
      if (this.selectedDonationIndex + 1 > 0) {
        this.donation = this.currencyPreset[this.selectedDonationIndex];
      } else {
        this.donation = this.count(this.donation / old.rate, this.currency);
      }
    },
    donation(value) {
      this.updateSelectedPreset(value);
    },
  },
  methods: {
    count(amountOfDollars, currency) {
      return Math.round(amountOfDollars * currency.rate);
    },
    getNearestBeautiful(num) {
      let count = 0;
      // counting number of decimals
      while (num > 1) {
        count++;
        num /= 10;
      }
      // save first half of decimals
      num *= Math.pow(10, Math.floor(count / 2));
      num = Math.floor(num) * Math.pow(10, count - Math.floor(count / 2));
      return num;
    },
    countBeautiful(amountOfDollars, currency) {
      return this.getNearestBeautiful(this.count(amountOfDollars, currency));
    },
    formatNumber(number) {
      return new Intl.NumberFormat("en-US").format(number);
    },
    selectPreset(value) {
      this.donation = value;
      this.updateSelectedPreset(value);
    },
    updateSelectedPreset(value) {
      this.selectedDonationIndex = this.currencyPreset.findIndex(
        (item) => item === value
      );
    },
    checkKey(event) {
      if (event.key === ".") {
        event.preventDefault();
      }
    },
    donate() {
      axios
        .post("http://localhost:3000/donate", {
          amount: this.donation,
          currency: this.currency.code,
        })
        .then((response) => {
          if (response.data.ok) {
            alert("Thank you for your donation!");
          } else {
            alert(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
