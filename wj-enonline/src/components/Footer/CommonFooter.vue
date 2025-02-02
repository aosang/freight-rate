<template>
  <div class="Common-Footer">
    <footer>
      <div class="Common-Footer-info">
        <div class="Footer-info-l">
          <h4>Contact-Us</h4>
          <p>Phone:&nbsp;+86-532-68997888</p>
          <p>Email:&nbsp;overseas@worldjaguar.com</p>
          <!-- <p>Address:&nbsp;36/F, New World Digital Port Flagship Building, No. 40 Hong Kong Middle Road, Qingdao</p> -->
        </div>
        <div class="Footer-info-r">
          <div class="info-img">
            <div class="info-img-item">
              <img src="https://wxa.worldjaguar.com/webview/images/wj_online/enonline_wrap.png" alt="">
              <span>Mobile</span>
            </div>
            <div class="info-img-item">
              <img src="https://wxa.worldjaguar.com/webview/images/wj_online/wj_gzh.jpg" alt="">
              <span>Wechat</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div class="Footer-common">
      <div class="Footer-inner">
        <div class="Footer-common-logo">
          <img src="https://wxa.worldjaguar.com/webview/images/wj_online/wj_logo_footer.png" alt="">
        </div>
        <div class="Footer-common-text">
          Copyright © 2022 - 2023 <a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备11032919号-3</a>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'Common-Footer',
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="less">
.Common-Footer {
  // position: fixed;
  // width: 100%;
  // bottom: 0;
  // left: 0;
  // z-index: 3000;
  footer {
    width: 100%;
    margin-top: 40px;
    background: #1e2434;

    .Common-Footer-info {
      display: flex;
      width: 1200px;
      margin: 0 auto;
      align-items: center;

      .Footer-info-l {
        padding: 34px 0;
        color: hsla(0,0%,100%,.6);
        font-size: 14px;

        h4 {
          margin-bottom: 10px;
          font-size: 15px;
          color: #fff;
        }

        p {
          margin-bottom: 10px;
        }
      }

      .Footer-info-r {
        margin: 0 0 0 auto;
        .info-img {
          display: flex;
          .info-img-item {
            width: 110px;
            background: rgba(187,206,255,.1);
            border-radius: 8px;
            padding: 8px;
            margin-right: 15px;
            img {
              display: block;
              width: 100%;
              // height: 100px;
              margin: 0 auto;
              border-radius: 8px;
            }

            span {
              margin-top: 5px;
              display: block;
              color: #fff;
              font-size: 13px;
              text-align: center;
            }
          }
        }
      }
    }
  }

  .Footer-common {
    width: 100%;
    height: 64px;
    background: #1a1f2d;
    .Footer-inner {
      display: flex;
      width: 1200px;
      margin: 0 auto;
      .Footer-common-logo {
        img {
          width: 70px;
          // height: 30px;
          opacity: .5;
          margin-top: 8px;
        }
      }
      .Footer-common-text {
        margin: 0 0 0 auto;
        font-size: 13px;
        color: hsla(0,0%,100%,.6);
        line-height: 60px;
        a {
          color: hsla(0,0%,100%,.6);
        }
      }
    }
  }
  
}
</style>