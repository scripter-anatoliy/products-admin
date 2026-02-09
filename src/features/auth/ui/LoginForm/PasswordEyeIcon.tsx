export function PasswordEyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <span style={{ display: "inline-flex", cursor: "pointer" }}>
        <svg
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g filter="url(#filter0_i_eye)">
            <path
              d="M9.58669 3.09232C9.99311 3.03223 10.4124 3 10.8442 3C15.9492 3 19.299 7.50484 20.4244 9.28682C20.5607 9.5025 20.6288 9.61034 20.6669 9.77667C20.6955 9.90159 20.6955 10.0987 20.6668 10.2236C20.6287 10.3899 20.5601 10.4985 20.4229 10.7156C20.1231 11.1901 19.6659 11.8571 19.0602 12.5805M5.56807 4.71504C3.406 6.1817 1.9382 8.21938 1.26486 9.28528C1.12803 9.50187 1.05962 9.61016 1.02149 9.77648C0.992847 9.9014 0.992836 10.0984 1.02146 10.2234C1.05958 10.3897 1.12768 10.4975 1.26388 10.7132C2.38929 12.4952 5.73916 17 10.8442 17C12.9026 17 14.6756 16.2676 16.1326 15.2766M1.84417 1L19.8442 19M8.72285 7.87868C8.17995 8.42157 7.84417 9.17157 7.84417 10C7.84417 11.6569 9.18731 13 10.8442 13C11.6726 13 12.4226 12.6642 12.9655 12.1213"
              stroke="#EDEDED"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_i_eye"
              x="0"
              y="0"
              width="21.6883"
              height="24"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_eye"
              />
            </filter>
          </defs>
        </svg>
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", cursor: "pointer" }}>
      <svg
        width="22"
        height="20"
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M11 3C6 3 2.5 6.5 1 9C2.5 11.5 6 15 11 15C16 15 19.5 11.5 21 9C19.5 6.5 16 3 11 3Z"
          stroke="#EDEDED"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 12C12.6569 12 14 10.6569 14 9C14 7.34315 12.6569 6 11 6C9.34315 6 8 7.34315 8 9C8 10.6569 9.34315 12 11 12Z"
          stroke="#EDEDED"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
