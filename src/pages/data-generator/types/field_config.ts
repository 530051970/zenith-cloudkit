// https://zhuanlan.zhihu.com/p/87203290
export const FIELD_CONFIG_CN = [{
  typeId:"01",
  typeName:"基本类型",
  subTypes:[{typeId:"0101",typeName:"整型",prefix:"integer",type:"string",eg:""},
            {typeId:"0102",typeName:"字符串",prefix:"string",type:"string",eg:""},
            {typeId:"0103",typeName:"日期",prefix:"date",type:"date",eg:""},
            {typeId:"0104",typeName:"布尔值",prefix:"bool",type:"boolean",eg:""}]
},{
  typeId:"02",
  typeName:"地址相关",
  subTypes:[{typeId:"0201",typeName:"详细地址",prefix:"detailed_address",type:"string",eg:"香港特别行政区大冶县上街钟街k座 664713"},
            {typeId:"0202",typeName:"楼名",prefix:"building_name",type:"string",eg:"V座"},
            {typeId:"0203",typeName:"完整城市名",prefix:"full_city_name",type:"string",eg:""},
            {typeId:"0204",typeName:"城市名称（不带市县）",prefix:"city_name_without_city_county",type:"string",eg:""},
            {typeId:"0205",typeName:"城市后缀名",prefix:"city_suffix",type:"string",eg:""},
            {typeId:"0206",typeName:"国家名称",prefix:"country_name",type:"string",eg:""},
            {typeId:"0207",typeName:"国家编号",prefix:"country_code",type:"string",eg:""},
            {typeId:"0208",typeName:"地区",prefix:"region",type:"string",eg:""},
            {typeId:"0209",typeName:"邮编",prefix:"postal_code",type:"string",eg:""},
            {typeId:"0210",typeName:"省",prefix:"province",type:"string",eg:""},
            {typeId:"0211",typeName:"街道",prefix:"street",type:"string",eg:"广州路"},
            {typeId:"0212",typeName:"街道后缀名",prefix:"street_suffix",type:"string",eg:""}]
},{
  typeId:"03",
  typeName:"汽车相关",
  subTypes:[{typeId:"0301",typeName:"牌照",prefix:"license_plate",type:"string",eg:""}]
},{
  typeId:"04",
  typeName:"银行/信用卡相关",
  subTypes:[{typeId:"0401",typeName:"银行所属国家",prefix:"bank_country",type:"string",eg:"GB"},
            {typeId:"0402",typeName:"基本银行账号",prefix:"basic_bank_account_number",type:"string",eg:""},
            {typeId:"0403",typeName:"国际银行代码",prefix:"international_bank_code",type:"string",eg:""},
            {typeId:"0404",typeName:"过期年月",prefix:"expiration_year_and_month",type:"string",eg:""},
            {typeId:"0405",typeName:"信用卡卡号",prefix:"credit_card_number",type:"string",eg:""},
            {typeId:"0406",typeName:"信用卡提供商",prefix:"credit_card_provider",type:"string",eg:""},
            {typeId:"0407",typeName:"信用卡安全码",prefix:"credit_card_security_code",type:"string",eg:""}]
},{
  typeId:"05",
  typeName:"公司相关",
  subTypes:[{typeId:"0501",typeName:"商业用词",prefix:"business_terms",type:"string",eg:""},
            {typeId:"0502",typeName:"口号",prefix:"slogan",type:"string",eg:""},
            {typeId:"0503",typeName:"公司名称",prefix:"company_name",type:"string",eg:"富罳科技有限公司"},
            {typeId:"0504",typeName:"公司名称前缀",prefix:"company_name_prefix",type:"string",eg:""},
            {typeId:"0505",typeName:"公司名称后缀",prefix:"company_name_suffix",type:"string",eg:""}]
},{
  typeId:"06",
  typeName:"职位相关",
  subTypes:[{typeId:"0601",typeName:"职位",prefix:"position",type:"string",eg:""}]
},{
  typeId:"07",
  typeName:"时间相关",
  subTypes:[{typeId:"0701",typeName:"AM/PM",prefix:"am",type:"string",eg:""},
            {typeId:"0702",typeName:"日期字符串（YYYY-MM-DD）",prefix:"date_string",type:"string",eg:""},
            {typeId:"0703",typeName:"日期字符串（YYYY-MM-DD）(过去)",prefix:"date_string_past",type:"string",eg:""},
            {typeId:"0704",typeName:"日期字符串（YYYY-MM-DD）(将来)",prefix:"date_string_future",type:"string",eg:""},
            {typeId:"0705",typeName:"日期",prefix:"date",type:"date",eg:""},
            {typeId:"0706",typeName:"日期和时间",prefix:"date_and_time",type:"datetime",eg:""},
            {typeId:"0707",typeName:"日期（过去）",prefix:"date_past",type:"date",eg:""},
            {typeId:"0708",typeName:"日期和时间",prefix:"date_and_time",type:"datetime",eg:""},
            {typeId:"0709",typeName:"日期（将来）",prefix:"date_future",type:"date",eg:""},
            {typeId:"0710",typeName:"日期和时间",prefix:"date_and_time",type:"datetime",eg:""}]
},{
  typeId:"08",
  typeName:"文件相关",
  subTypes:[{typeId:"0801",typeName:"文件扩展名",prefix:"file_extension",type:"string",eg:""},
            {typeId:"0802",typeName:"文件全名",prefix:"file_full_name",type:"string",eg:""},
            {typeId:"0803",typeName:"文件路径",prefix:"file_path",type:"string",eg:""},
            {typeId:"0804",typeName:"文件路径+文件全名",prefix:"file_path",type:"string",eg:""}]
},{
  typeId:"09",
  typeName:"网络相关",
  subTypes:[{typeId:"0901",typeName:"企业邮箱",prefix:"corporate_email",type:"string",eg:""},
            {typeId:"0902",typeName:"个人邮箱",prefix:"personal_email",type:"string",eg:""},
            {typeId:"0903",typeName:"域名",prefix:"domain_name",type:"string",eg:""},
            {typeId:"0904",typeName:"二级域名",prefix:"subdomain",type:"string",eg:""},
            {typeId:"0905",typeName:"主机名",prefix:"hostname",type:"string",eg:""},
            {typeId:"0906",typeName:"URL",prefix:"url",type:"string",eg:""},
            {typeId:"0907",typeName:"IPV4",prefix:"ipv4",type:"string",eg:""},
            {typeId:"0908",typeName:"IPV6",prefix:"ipv6",type:"string",eg:""},
            {typeId:"0909",typeName:"MAC地址",prefix:"mac_address",type:"string",eg:""}]
},{
  typeId:"10",
  typeName:"人物相关",
  subTypes:[{typeId:"1001",typeName:"姓名",prefix:"name",type:"string",eg:""},
            {typeId:"1002",typeName:"姓名（女）",prefix:"female_name",type:"string",eg:""},
            {typeId:"1003",typeName:"姓名（男）",prefix:"male_name",type:"string",eg:""},
            {typeId:"1004",typeName:"姓",prefix:"last_name",type:"string",eg:""},
            {typeId:"1005",typeName:"名",prefix:"first_name",type:"string",eg:""}]
},{
  typeId:"11",
  typeName:"证件相关",
  subTypes:[{typeId:"1101",typeName:"身份证",prefix:"id_card",type:"string",eg:""},
            {typeId:"1102",typeName:"护照",prefix:"passport",type:"string",eg:""},
            {typeId:"1103",typeName:"驾照",prefix:"driver_license",type:"string",eg:""}]
},{
  typeId:"12",
  typeName:"电话相关",
  subTypes:[{typeId:"1201",typeName:"完整手机号码（包含国家和国内区号）",prefix:"complete_phone_number",type:"string",eg:""},
            {typeId:"1202",typeName:"手机号",prefix:"mobile_number",type:"string",eg:""},
            {typeId:"1203",typeName:"座机号",prefix:"landline_number",type:"string",eg:""},
            {typeId:"1204",typeName:"区号",prefix:"area_code",type:"string",eg:""}]
} 
];

export const LANG = [
"ar_EG - Arabic (Egypt)",
"ar_PS - Arabic (Palestine)",
"ar_SA - Arabic (Saudi Arabia)",
"bg_BG - Bulgarian",
"bs_BA - Bosnian",
"cs_CZ - Czech",
"de_DE - German",
"dk_DK - Danish",
"el_GR - Greek",
"en_AU - English (Australia)",
"en_CA - English (Canada)",
"en_GB - English (Great Britain)",
"en_NZ - English (New Zealand)",
"en_US - English (United States)",
"es_ES - Spanish (Spain)",
"es_MX - Spanish (Mexico)",
"et_EE - Estonian",
"fa_IR - Persian (Iran)",
"fi_FI - Finnish",
"fr_FR - French",
"hi_IN - Hindi",
"hr_HR - Croatian",
"hu_HU - Hungarian",
"hy_AM - Armenian",
"it_IT - Italian",
"ja_JP - Japanese",
"ka_GE - Georgian (Georgia)",
"ko_KR - Korean",
"lt_LT - Lithuanian",
"lv_LV - Latvian",
"ne_NP - Nepali",
"nl_NL - Dutch (Netherlands)",
"no_NO - Norwegian",
"pl_PL - Polish",
"pt_BR - Portuguese (Brazil)",
"pt_PT - Portuguese (Portugal)",
"ro_RO - Romanian",
"ru_RU - Russian",
"sl_SI - Slovene",
"sv_SE - Swedish",
"tr_TR - Turkish",
"uk_UA - Ukrainian",
"zh_CN - Chinese (China Mainland)",
"zh_TW - Chinese (China Taiwan)"
]

export const RANDOM_TYPE = [
  {id:"int", name:"整数", probability: 0.35},
  {id:"string", name:"字符串", probability: 0.35},
  {id:"text", name:"文本", probability: 0.15},
  {id:"datetime", name:"日期和时间", probability: 0},
  {id:"decimal", name:"DECIMAL", probability: 0.04},
  {id:"smallint", name:"SMALLINT", probability: 0.04},
  {id:"char", name:"字符", probability: 0.03},
  {id:"date", name:"日期", probability: 0},
  {id:"time", name:"时间", probability: 0.01},
  {id:"timestamp", name:"时间戳", probability: 0}
]

export const DEFAULT_CONFIG = {
  prefix: "demo",
  minLength: 3,
  maxLength: 15,
  maxIntLength: 5,
  maxDecimalLength: 5,
  startDate: "1970-01-01",
  endDate: "2050-12-31",
  outputType: "Local",
  outputFormat: "excel"
}
// S3
// <svg class="w-6 h-6" height="48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M35.969 7.575a44.22 44.22 0 00-3.833-.555C29.756 5.977 25.443 5 19.406 5 8.716 5 4.075 7.812 4.007 8.741l.022.15c.205.53 1.649 1.508 5.289 2.238-.515.541-.89 1.142-1.081 1.812-1.412-.316-2.747-.724-3.818-1.258l3.424 24.458c.006.046.01.093.01.14.04.156.693.84 3.018 1.478l.298 2.13c-3.457-.806-5.255-1.99-5.315-3.528L2.068 9.314c-.013-.052-.014-.11-.024-.164l-.034-.248-.006-.048C2.002 8.807 2 8.811 2 8.764 2 5.02 10.969 3 19.407 3c7.458 0 14.98 1.57 16.562 4.575zm5.929 21.405l.134-1.017c.999.61 1.493 1.031 1.733 1.29-.318.012-.9-.042-1.867-.273zm-3.661 12.425a.793.793 0 00-.008.12c-.03.113-.395.551-1.655 1.043-.63.246-1.376.468-2.217.66-2.18.497-4.852.772-7.528.772-7.106 0-11.21-1.736-11.395-2.463a1.07 1.07 0 00-.01-.139L12 16.945c3.31 1.661 9.468 2.31 14.989 2.31 5.326 0 11.259-.644 14.479-2.285l-1.517 11.46c-3.867-1.227-8.921-3.506-11.2-4.567a1.915 1.915 0 00-1.886-1.607 1.92 1.92 0 00-1.918 1.918 1.92 1.92 0 001.918 1.917c.423 0 .81-.142 1.128-.374 2.693 1.253 7.782 3.527 11.693 4.728l-1.45 10.96zM26.99 10.257c9.572 0 14.813 2.457 14.873 3.74l-.013.093c-.186 1.172-5.143 3.164-14.86 3.164-9.917 0-15.185-2.022-15.388-3.164l-.013-.093c.068-.929 4.708-3.74 15.4-3.74zm18.965 18.931c-.191-1.028-1.3-2.05-3.64-3.373l1.544-11.664c.003-.044.008-.086.008-.13 0-3.785-8.49-5.764-16.877-5.764-8.44 0-17.408 2.02-17.408 5.763 0 .047-.001.048.002.095l.008.044 3.843 27.46C13.568 44.83 21.49 46 26.829 46c2.822 0 5.654-.292 7.972-.822a17.537 17.537 0 002.5-.748c1.899-.74 2.883-1.689 2.925-2.817l1.408-10.643c.818.184 1.507.281 2.072.281.892 0 1.494-.229 1.884-.689.328-.386.458-.875.365-1.374z" fill="#3F8624" fill-rule="evenodd"></path></svg>
// RDS
// <svg class="w-6 h-6" height="48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M21.24 25.383c-.25 0-.55-.036-.902-.107a6.442 6.442 0 01-.948-.267v1.19c.242.137.54.246.896.33.355.083.711.125 1.066.125.819 0 1.459-.21 1.924-.63.465-.42.698-.99.698-1.707 0-.371-.055-.687-.165-.948-.11-.26-.28-.497-.51-.71a4.68 4.68 0 00-.936-.634l-.613-.33c-.332-.18-.558-.347-.675-.5a.924.924 0 01-.177-.578c0-.28.093-.5.274-.657.18-.16.43-.24.748-.24.468 0 1.01.114 1.623.342V18.86a4.213 4.213 0 00-1.781-.41c-.477 0-.899.093-1.265.279a2.12 2.12 0 00-.869.794c-.21.344-.317.747-.317 1.208 0 .5.12.923.363 1.27.242.349.643.674 1.204.977l.61.329c.311.166.532.33.665.493a.915.915 0 01.198.596c0 .318-.093.56-.284.73-.189.172-.465.257-.828.257zm-4.47-2.95c0-.892-.12-1.548-.358-1.97-.238-.418-.61-.63-1.117-.63h-.66v5.437h.67c.492 0 .858-.214 1.102-.641.24-.43.363-1.085.363-1.97v-.226zm.872-2.814c.508.666.76 1.64.76 2.927 0 1.294-.248 2.274-.748 2.94-.5.665-1.226.998-2.178.998h-2.428V18.62h2.371c.976 0 1.716.333 2.223.998zm-7.441 1.475c0-.423-.079-.744-.232-.964-.156-.22-.381-.33-.676-.33h-.738v2.588h.738c.295 0 .52-.11.676-.33.154-.22.232-.54.232-.964zm.385 2.236l1.588 3.154h-1.633l-1.373-2.916h-.613v2.916H7.002V18.62h2.484c.695 0 1.25.22 1.662.664.412.442.617 1.045.617 1.809 0 .529-.101.987-.305 1.373a1.97 1.97 0 01-.874.863zm31.007-8.192v-4.255c0-.552-.116-.972-.346-1.26-.231-.287-.566-.43-1.004-.43-.553 0-1.13.223-1.736.669l-.124-.522H37.11v5.798h1.555v-4.493c.28-.182.537-.273.77-.273.22 0 .376.076.467.227.09.152.136.394.136.726v3.813h1.554zm-7.125-2.893c0-.643-.063-1.116-.188-1.42-.123-.301-.327-.453-.605-.453-.28 0-.483.152-.608.454-.124.303-.188.776-.188 1.419s.064 1.114.188 1.412c.124.299.328.449.608.449.279 0 .482-.15.606-.45.125-.297.188-.768.188-1.411zm.942-2.258c.409.529.613 1.282.613 2.258 0 .968-.205 1.716-.613 2.245-.407.53-.986.795-1.735.795-.748 0-1.328-.264-1.737-.795-.409-.53-.612-1.277-.612-2.245 0-.976.203-1.73.611-2.258.41-.53.99-.794 1.738-.794s1.328.264 1.736.794zm-8.815 5.15h4.027v-1.191H28.23l2.348-3.505V9.34h-3.893v1.19h2.258l-2.348 3.507v1.1zm-2.361-1.304V12.72a1.946 1.946 0 00-.59-.08c-.218 0-.387.07-.504.21-.119.14-.177.344-.177.607 0 .228.047.407.142.539a.442.442 0 00.38.198c.25 0 .5-.121.748-.362zm-.465 1.266a1.605 1.605 0 01-.737.186c-.47 0-.84-.152-1.111-.46-.273-.305-.41-.727-.41-1.264 0-.568.166-1.016.5-1.345.332-.33.783-.493 1.35-.493.233 0 .524.046.872.136v-.522c0-.393-.05-.66-.152-.8s-.293-.21-.572-.21c-.456 0-1.01.12-1.668.363V9.657c.218-.143.505-.256.861-.34a4.774 4.774 0 011.09-.124c.657 0 1.134.149 1.43.448.294.299.442.777.442 1.435v4.062h-1.203l-.135-.522a1.445 1.445 0 01-.556.483zm-3.358.039v-4.255c0-.545-.114-.962-.34-1.254-.228-.291-.554-.436-.977-.436-.529 0-1.104.23-1.724.692-.22-.462-.598-.692-1.134-.692-.53 0-1.098.223-1.702.669l-.126-.522h-1.27v5.798h1.555v-4.493c.279-.182.526-.273.737-.273.204 0 .35.076.438.227.086.152.13.39.13.716v3.823h1.554V10.77a.606.606 0 00-.011-.125c.28-.182.53-.273.748-.273.204 0 .35.076.438.227.085.152.13.39.13.716v3.823h1.553zm-10.403-3.006l-.715-3.257-.692 3.257h1.407zm2.394 3.006h-1.747l-.41-1.872H8.364l-.397 1.872H6.297l2.178-7.862h1.758l2.168 7.862zm31.6 14.868V26.47c-1.73.943-4.354 1.432-6.966 1.432-2.611 0-5.235-.49-6.965-1.432v3.535c0 .629 2.37 2.104 6.965 2.104 4.596 0 6.966-1.475 6.966-2.104zm0 6.098v-3.426c-1.73.943-4.354 1.432-6.966 1.432-2.611 0-5.235-.49-6.965-1.432v3.426c0 .629 2.37 2.103 6.965 2.103 4.596 0 6.966-1.474 6.966-2.103zm0 5.444v-2.772c-1.73.943-4.354 1.43-6.966 1.43-2.611 0-5.235-.487-6.965-1.43v2.772c0 .629 2.37 2.104 6.965 2.104 4.596 0 6.966-1.475 6.966-2.104zm-13.93-17.75c0 .63 2.369 2.105 6.964 2.105 4.596 0 6.966-1.475 6.966-2.104 0-.63-2.37-2.104-6.966-2.104s-6.965 1.475-6.965 2.104zm15.93 0v17.75c0 2.694-4.51 4.104-8.966 4.104-4.455 0-8.965-1.41-8.965-4.104v-17.75c0-2.693 4.51-4.102 8.965-4.102 4.456 0 8.966 1.409 8.966 4.103zM7.755 43.893h19.682v2H7.755A5.76 5.76 0 012 40.138V7.755A5.761 5.761 0 017.754 2h32.383a5.762 5.762 0 015.755 5.755v12.7h-2v-12.7A3.76 3.76 0 0040.136 4H7.755a3.758 3.758 0 00-3.753 3.755v32.383a3.758 3.758 0 003.753 3.754z" fill="#2E27AD" fill-rule="evenodd"></path></svg>
// Redshift
// <svg class="w-6 h-6" height="40" width="40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="Arch_Amazon-Redshift_32_svg__a"><stop stop-color="#4D27A8" offset="0%"></stop><stop stop-color="#A166FF" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z" fill="url(#Arch_Amazon-Redshift_32_svg__a)"></path><path d="M25.912 17.587a.96.96 0 01-.959-.957.96.96 0 011.919 0 .96.96 0 01-.96.957m-2.433 5.826a.96.96 0 01-.959-.958.96.96 0 011.919 0 .96.96 0 01-.96.958m-5.838-.97a.959.959 0 11.001-1.913.959.959 0 01-.001 1.912m-2.431 5.34a.96.96 0 01-.96-.957.96.96 0 011.919 0 .96.96 0 01-.959.957m10.702-13.108a1.96 1.96 0 00-1.959 1.956c0 .66.332 1.243.837 1.598l-.913 2.312a1.953 1.953 0 00-2.243 1.288l-2.045-.464a1.954 1.954 0 00-3.906.12c0 .504.197.96.511 1.306l-.892 2.09c-.032-.003-.061-.01-.092-.01a1.96 1.96 0 00-1.96 1.955 1.96 1.96 0 003.919 0c0-.692-.364-1.297-.908-1.645l.787-1.842c.188.06.385.102.593.102.771 0 1.432-.45 1.752-1.097l2.165.491a1.96 1.96 0 003.881-.38c0-.582-.261-1.1-.669-1.458l.959-2.43c.062.006.121.019.183.019a1.96 1.96 0 001.96-1.955 1.96 1.96 0 00-1.96-1.956M20.5 33.002c-4.865 0-8.5-1.46-8.5-2.765V11.59c1.663 1.338 5.153 2.049 8.5 2.049 3.347 0 6.837-.71 8.5-2.05v18.648c0 1.305-3.635 2.765-8.5 2.765m0-26.004c5.009 0 8.5 1.486 8.5 2.821 0 1.335-3.491 2.822-8.5 2.822S12 11.154 12 9.819s3.491-2.821 8.5-2.821M30 9.819C30 7.34 25.105 6 20.5 6 15.894 6 11 7.338 11 9.82l.002.011H11v20.406C11 32.68 15.894 34 20.5 34c4.605 0 9.5-1.32 9.5-3.763V9.83h-.002L30 9.82" fill="#FFF"></path></g></svg>