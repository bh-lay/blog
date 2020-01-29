let blurCanvas = document.createElement('canvas');
blurCanvas.width = screen.width;
blurCanvas.height = screen.height;
let blurCtx = blurCanvas.getContext('2d');

function saturate (src, w, h, sv) {

  let len = w * h;
  let pos, i, j, offset;

  let lumR = (1 - sv) * 0.3086;
  let lumG = (1 - sv) * 0.6094;
  let lumB = (1 - sv) * 0.0820;

  let r, g, b;

  let shiftW = w << 2;

  for (j = 0; j < h; j++) {

    offset = j * shiftW;

    for (i = 0; i < w; i++) {

      pos = offset + (i << 2);

      r = src[pos];
      g = src[pos + 1];
      b = src[pos + 2];

      src[pos] = ((lumR + sv) * r) +
        (lumG * g) +
        (lumB * b);

      src[pos + 1] = (lumR * r) +
        ((lumG + sv) * g) +
        (lumB * b);

      src[pos + 2] = (lumR * r) +
        (lumG * g) +
        ((lumB + sv) * b);

    }

  }

};

function boxBlur (src, w, h, r, sv) {
  let tmp = new Uint8Array(w * h * 4);
  blurRight(src, tmp, w, h, r);
  blurDown(tmp, src, w, h, r);
  blurLeft(src, tmp, w, h, r);
  blurUp(tmp, src, w, h, r);
  (sv !== undefined && sv !== 1) && saturate(src, w, h, sv);
};

function blurRight (src, dest, w, h, r) {

  let i, j, offset, pos, posR;

  let shiftR = r << 2;
  let shiftW = w << 2;

  let weightR, weightG, weightB, weightA;

  for (j = 0; j < h; j++) {

    weightR = 0;
    weightG = 0;
    weightB = 0;
    weightA = 0;

    offset = j * shiftW;

    for (i = 0; i < r; i++) {

      pos = offset + (i << 2);

      weightR += src[pos];
      weightG += src[pos + 1];
      weightB += src[pos + 2];
      weightA += src[pos + 3];

      dest[pos] = (weightR / (i + 1)) | 0;
      dest[pos + 1] = (weightG / (i + 1)) | 0;
      dest[pos + 2] = (weightB / (i + 1)) | 0;
      dest[pos + 3] = (weightA / (i + 1)) | 0;

    }

    for (; i < w; i++) {

      pos = offset + (i << 2);
      posR = pos - shiftR;

      dest[pos] = (weightR / r) | 0;
      dest[pos + 1] = (weightG / r) | 0;
      dest[pos + 2] = (weightB / r) | 0;
      dest[pos + 3] = (weightA / r) | 0;

      weightR += src[pos] - src[posR];
      weightG += src[pos + 1] - src[posR + 1];
      weightB += src[pos + 2] - src[posR + 2];
      weightA += src[pos + 3] - src[posR + 3];

    }

  }

};

function blurLeft (src, dest, w, h, r) {

  let i, j, offset, pos, posR;

  let shiftR = r << 2;
  let shiftW = w << 2;

  let weightR, weightG, weightB, weightA;

  for (j = 0; j < h; j++) {

    weightR = 0;
    weightG = 0;
    weightB = 0;
    weightA = 0;

    offset = j * shiftW;

    for (i = w - 1; i >= w - r; i--) {

      pos = offset + (i << 2);

      weightR += src[pos];
      weightG += src[pos + 1];
      weightB += src[pos + 2];
      weightA += src[pos + 3];

      dest[pos] = (weightR / (w - i)) | 0;
      dest[pos + 1] = (weightG / (w - i)) | 0;
      dest[pos + 2] = (weightB / (w - i)) | 0;
      dest[pos + 3] = (weightA / (w - i)) | 0;

    }

    for (; i >= 0; i--) {

      pos = offset + (i << 2);
      posR = pos + shiftR;

      dest[pos] = (weightR / r) | 0;
      dest[pos + 1] = (weightG / r) | 0;
      dest[pos + 2] = (weightB / r) | 0;
      dest[pos + 3] = (weightA / r) | 0;

      weightR += src[pos] - src[posR];
      weightG += src[pos + 1] - src[posR + 1];
      weightB += src[pos + 2] - src[posR + 2];
      weightA += src[pos + 3] - src[posR + 3];

    }

  }

};

function blurDown (src, dest, w, h, r) {

  let i, j, offset, pos, posR;

  let shiftR = r << 2;
  let shiftW = w << 2;

  let offsetR = shiftW * r;

  let weightR, weightG, weightB, weightA;

  for (i = 0; i < w; i++) {

    weightR = 0;
    weightG = 0;
    weightB = 0;
    weightA = 0;

    offset = i << 2;

    for (j = 0; j < r; j++) {

      pos = offset + (j * shiftW);

      weightR += src[pos];
      weightG += src[pos + 1];
      weightB += src[pos + 2];
      weightA += src[pos + 3];

      dest[pos] = (weightR / (j + 1)) | 0;
      dest[pos + 1] = (weightG / (j + 1)) | 0;
      dest[pos + 2] = (weightB / (j + 1)) | 0;
      dest[pos + 3] = (weightA / (j + 1)) | 0;

    }

    for (; j < h; j++) {

      pos = offset + (j * shiftW);
      posR = pos - offsetR;

      dest[pos] = (weightR / r) | 0;
      dest[pos + 1] = (weightG / r) | 0;
      dest[pos + 2] = (weightB / r) | 0;
      dest[pos + 3] = (weightA / r) | 0;

      weightR += src[pos] - src[posR];
      weightG += src[pos + 1] - src[posR + 1];
      weightB += src[pos + 2] - src[posR + 2];
      weightA += src[pos + 3] - src[posR + 3];

    }

  }

};

function blurUp (src, dest, w, h, r) {

  let i, j, offset, pos, posR;

  let shiftR = r << 2;
  let shiftW = w << 2;

  let offsetR = shiftW * r;

  let weightR, weightG, weightB, weightA;

  for (i = 0; i < w; i++) {

    weightR = 0;
    weightG = 0;
    weightB = 0;
    weightA = 0;

    offset = i << 2;

    for (j = h - 1; j >= h - r; j--) {

      pos = offset + (j * shiftW);

      weightR += src[pos];
      weightG += src[pos + 1];
      weightB += src[pos + 2];
      weightA += src[pos + 3];

      dest[pos] = (weightR / (h - j)) | 0;
      dest[pos + 1] = (weightG / (h - j)) | 0;
      dest[pos + 2] = (weightB / (h - j)) | 0;
      dest[pos + 3] = (weightA / (h - j)) | 0;

    }

    for (; j >= 0; j--) {

      pos = offset + (j * shiftW);
      posR = pos + offsetR;

      dest[pos] = (weightR / r) | 0;
      dest[pos + 1] = (weightG / r) | 0;
      dest[pos + 2] = (weightB / r) | 0;
      dest[pos + 3] = (weightA / r) | 0;

      weightR += src[pos] - src[posR];
      weightG += src[pos + 1] - src[posR + 1];
      weightB += src[pos + 2] - src[posR + 2];
      weightA += src[pos + 3] - src[posR + 3];

    }

  }

};

function blurRect (context, x, y, w, h, r, sv) {

  let ctx = context;
  let canvas = ctx.canvas;

  let srcW = w | 0;
  let srcH = h | 0;

  let srcX = x | 0;
  let srcY = y | 0;

  r = Math.min(Math.max(r, 8), 256);

  let resizeFactor = Math.max(0, ((Math.log(r) / Math.log(2)) - 3) | 0);
  let radius = r >>> resizeFactor;

  let resizeWidth = canvas.width >>> resizeFactor;
  let resizeHeight = canvas.height >>> resizeFactor;

  blurCtx.drawImage(canvas, 0, 0, resizeWidth, resizeHeight);
  let imageData = blurCtx.getImageData(0, 0, resizeWidth, resizeHeight);

  boxBlur(imageData.data, resizeWidth, resizeHeight, radius, sv);

  blurCtx.putImageData(imageData, 0, 0);

  blurCtx.drawImage(
    blurCanvas,
    0, 0,
    resizeWidth, resizeHeight,
    0, 0,
    canvas.width, canvas.height
  );

  ctx.drawImage(
    blurCanvas,
    srcX, srcY,
    srcW, srcH,
    srcX, srcY,
    srcW, srcH
  );

  return ctx;

};

export default blurRect;