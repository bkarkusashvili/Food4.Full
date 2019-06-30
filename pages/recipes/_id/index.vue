<template>
  <article class="recipe-page">
    <div class="container">
      <div class="promo-box hero" style="background-image: url('/img/pizza.jpg')">
        <div class="promo-box-content hero-body">
          <h1 class="title">პიცა პეპერონით და ზეთისხილით</h1>
          <h2 class="subtitle">პიცა პიცა პიცა</h2>
        </div>
      </div>

      <section class="recipe-ingredients">
        <h2 class="section-header">ინგრედიენტები</h2>
        <ul>
          <li>
            <label>
              <input type="checkbox" />
              <span>შვრია - 4 ჭიქა</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>ქართული მიწის თხილი - 1/2 ჭიქა</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>ნუში 1/2 ჭიქა</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>ნიგოზი - 1/2 ჭიქა</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>გოგრის თესლი - 1/3 ჭიქა</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>ქიშმიში - 1/3 ჭიქა</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>ქოქოსის ზეთი (შეგიძლიათ ჩაანაცვლოთ ზეითუნის ზეთით) - 1/2 ჭიქა</span>
            </label>
          </li>

          <li>
            <label>
              <input type="checkbox" />
              <span>თაფლი - 1/2 ჭიქა</span>
            </label>
          </li>
        </ul>
      </section>
      <section class="recipe-preparation">
        <h2 class="section-header">მომზადება</h2>
        <p>
          გაახურეთ გაზქურა 180 გრადუსზე<br>
          აურიეთ ერთმანეთში მშრალი ინგრედიენტები<br>
          აურიეთ ერთმანეთში ქოქოსის ზეთი და თაფლი და ჩაასხით მშრალ ინგრედიენტებში.<br>
          შედგით მიღებული მასა გაზქურაში და შეამოწმეთ თავიდან 10 წუთში, შემდეგ ყოველ 5 წუთში და მოურიეთ. <br>
          როგორც კი ფერს შეიცვლის და ნახავთ რომ შვრიაც და თხილეულიც კარგად არის დაბრაწული, გამოიღეთ და გააცივეთ ბოლომდე. დაამატეთ ქიშმიში (შეგიძლიათ დაამატოთ ნებისმიერი გამომშრალი კენკრა) <br>
          შეინახეთ შუშის კონტეინერში. <br>
          შეგიძლიათ მიირთვათ მაწოთან, რძესთან, შვრიის ფაფასთან ერთად. <br>
          ჩემი არჩევანია მაწონი. ბლენდერში ჩაასხით მაწონი, ჩაამატეთ სეზონური ხილი ან კენკრა. ასევე წყალში 30 წუთით გაჩერებული ჩიის მარცვლები. <br>
          მიღებულ მასას მოაყარეთ გრანოლა, დარჩენილი ხილი ან კენკრა და მიირთვით. <br>
        </p>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  components: {}
};
</script>

<style lang="scss">
.recipe-page {
  .container {
    background: white;
  }

  .hero {
    min-height: 300px;
  }

  section {
    padding: 20px;
  }

  .promo-box {
    height: auto;
    cursor: auto;
  }

  .promo-box-content:hover {
    background: linear-gradient(rgba(34, 34, 34, 0), rgba(34, 34, 34, 0.9));
  }

  .recipe-ingredients {
    input:checked + span {
      text-decoration: line-through;
    }
    ul {
      columns: 2;
    }
  }

  .section-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: .5em;
  }
}
</style>
