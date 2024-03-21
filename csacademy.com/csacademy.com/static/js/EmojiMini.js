// Emoji from EmojiOne - http://emojione.com - license:https://creativecommons.org/licenses/by/4.0/

(function() {
    const DATA = {
        isFull: false,
        EMOJI: {
            "100": {
                "unicode": "1f4af",
                "key": ":100:"
            },
            "1234": {
                "unicode": "1f522",
                "key": ":1234:"
            },
            "8ball": {
                "unicode": "1f3b1",
                "key": ":8ball:"
            },
            "a": {
                "unicode": "1f170",
                "key": ":a:"
            },
            "ab": {
                "unicode": "1f18e",
                "key": ":ab:"
            },
            "abc": {
                "unicode": "1f524",
                "key": ":abc:"
            },
            "abcd": {
                "unicode": "1f521",
                "key": ":abcd:"
            },
            "accept": {
                "unicode": "1f251",
                "key": ":accept:"
            },
            "aerial_tramway": {
                "unicode": "1f6a1",
                "key": ":aerial_tramway:"
            },
            "airplane": {
                "unicode": "2708",
                "key": ":airplane:"
            },
            "airplane_arriving": {
                "unicode": "1f6ec",
                "key": ":airplane_arriving:"
            },
            "airplane_departure": {
                "unicode": "1f6eb",
                "key": ":airplane_departure:"
            },
            "airplane_small": {
                "unicode": "1f6e9",
                "key": ":airplane_small:"
            },
            "alarm_clock": {
                "unicode": "23f0",
                "key": ":alarm_clock:"
            },
            "alembic": {
                "unicode": "2697",
                "key": ":alembic:"
            },
            "alien": {
                "unicode": "1f47d",
                "key": ":alien:"
            },
            "ambulance": {
                "unicode": "1f691",
                "key": ":ambulance:"
            },
            "amphora": {
                "unicode": "1f3fa",
                "key": ":amphora:"
            },
            "anchor": {
                "unicode": "2693",
                "key": ":anchor:"
            },
            "angel": {
                "unicode": "1f47c",
                "key": ":angel:"
            },
            "angel_tone1": {
                "unicode": "1f47c-1f3fb",
                "key": ":angel_tone1:"
            },
            "angel_tone2": {
                "unicode": "1f47c-1f3fc",
                "key": ":angel_tone2:"
            },
            "angel_tone3": {
                "unicode": "1f47c-1f3fd",
                "key": ":angel_tone3:"
            },
            "angel_tone4": {
                "unicode": "1f47c-1f3fe",
                "key": ":angel_tone4:"
            },
            "angel_tone5": {
                "unicode": "1f47c-1f3ff",
                "key": ":angel_tone5:"
            },
            "anger": {
                "unicode": "1f4a2",
                "key": ":anger:"
            },
            "anger_right": {
                "unicode": "1f5ef",
                "key": ":anger_right:"
            },
            "angry": {
                "unicode": "1f620",
                "key": ":angry:"
            },
            "anguished": {
                "unicode": "1f627",
                "key": ":anguished:"
            },
            "ant": {
                "unicode": "1f41c",
                "key": ":ant:"
            },
            "apple": {
                "unicode": "1f34e",
                "key": ":apple:"
            },
            "aquarius": {
                "unicode": "2652",
                "key": ":aquarius:"
            },
            "aries": {
                "unicode": "2648",
                "key": ":aries:"
            },
            "arrow_backward": {
                "unicode": "25c0",
                "key": ":arrow_backward:"
            },
            "arrow_double_down": {
                "unicode": "23ec",
                "key": ":arrow_double_down:"
            },
            "arrow_double_up": {
                "unicode": "23eb",
                "key": ":arrow_double_up:"
            },
            "arrow_down": {
                "unicode": "2b07",
                "key": ":arrow_down:"
            },
            "arrow_down_small": {
                "unicode": "1f53d",
                "key": ":arrow_down_small:"
            },
            "arrow_forward": {
                "unicode": "25b6",
                "key": ":arrow_forward:"
            },
            "arrow_heading_down": {
                "unicode": "2935",
                "key": ":arrow_heading_down:"
            },
            "arrow_heading_up": {
                "unicode": "2934",
                "key": ":arrow_heading_up:"
            },
            "arrow_left": {
                "unicode": "2b05",
                "key": ":arrow_left:"
            },
            "arrow_lower_left": {
                "unicode": "2199",
                "key": ":arrow_lower_left:"
            },
            "arrow_lower_right": {
                "unicode": "2198",
                "key": ":arrow_lower_right:"
            },
            "arrow_right": {
                "unicode": "27a1",
                "key": ":arrow_right:"
            },
            "arrow_right_hook": {
                "unicode": "21aa",
                "key": ":arrow_right_hook:"
            },
            "arrow_up": {
                "unicode": "2b06",
                "key": ":arrow_up:"
            },
            "arrow_up_down": {
                "unicode": "2195",
                "key": ":arrow_up_down:"
            },
            "arrow_up_small": {
                "unicode": "1f53c",
                "key": ":arrow_up_small:"
            },
            "arrow_upper_left": {
                "unicode": "2196",
                "key": ":arrow_upper_left:"
            },
            "arrow_upper_right": {
                "unicode": "2197",
                "key": ":arrow_upper_right:"
            },
            "arrows_clockwise": {
                "unicode": "1f503",
                "key": ":arrows_clockwise:"
            },
            "arrows_counterclockwise": {
                "unicode": "1f504",
                "key": ":arrows_counterclockwise:"
            },
            "art": {
                "unicode": "1f3a8",
                "key": ":art:"
            },
            "articulated_lorry": {
                "unicode": "1f69b",
                "key": ":articulated_lorry:"
            },
            "asterisk": {
                "unicode": "002a-20e3",
                "key": ":asterisk:"
            },
            "astonished": {
                "unicode": "1f632",
                "key": ":astonished:"
            },
            "athletic_shoe": {
                "unicode": "1f45f",
                "key": ":athletic_shoe:"
            },
            "atm": {
                "unicode": "1f3e7",
                "key": ":atm:"
            },
            "atom": {
                "unicode": "269b",
                "key": ":atom:"
            },
            "avocado": {
                "unicode": "1f951",
                "key": ":avocado:"
            },
            "b": {
                "unicode": "1f171",
                "key": ":b:"
            },
            "baby": {
                "unicode": "1f476",
                "key": ":baby:"
            },
            "baby_bottle": {
                "unicode": "1f37c",
                "key": ":baby_bottle:"
            },
            "baby_chick": {
                "unicode": "1f424",
                "key": ":baby_chick:"
            },
            "baby_symbol": {
                "unicode": "1f6bc",
                "key": ":baby_symbol:"
            },
            "baby_tone1": {
                "unicode": "1f476-1f3fb",
                "key": ":baby_tone1:"
            },
            "baby_tone2": {
                "unicode": "1f476-1f3fc",
                "key": ":baby_tone2:"
            },
            "baby_tone3": {
                "unicode": "1f476-1f3fd",
                "key": ":baby_tone3:"
            },
            "baby_tone4": {
                "unicode": "1f476-1f3fe",
                "key": ":baby_tone4:"
            },
            "baby_tone5": {
                "unicode": "1f476-1f3ff",
                "key": ":baby_tone5:"
            },
            "back": {
                "unicode": "1f519",
                "key": ":back:"
            },
            "bacon": {
                "unicode": "1f953",
                "key": ":bacon:"
            },
            "badminton": {
                "unicode": "1f3f8",
                "key": ":badminton:"
            },
            "baggage_claim": {
                "unicode": "1f6c4",
                "key": ":baggage_claim:"
            },
            "balloon": {
                "unicode": "1f388",
                "key": ":balloon:"
            },
            "ballot_box": {
                "unicode": "1f5f3",
                "key": ":ballot_box:"
            },
            "ballot_box_with_check": {
                "unicode": "2611",
                "key": ":ballot_box_with_check:"
            },
            "bamboo": {
                "unicode": "1f38d",
                "key": ":bamboo:"
            },
            "banana": {
                "unicode": "1f34c",
                "key": ":banana:"
            },
            "bangbang": {
                "unicode": "203c",
                "key": ":bangbang:"
            },
            "bank": {
                "unicode": "1f3e6",
                "key": ":bank:"
            },
            "bar_chart": {
                "unicode": "1f4ca",
                "key": ":bar_chart:"
            },
            "barber": {
                "unicode": "1f488",
                "key": ":barber:"
            },
            "baseball": {
                "unicode": "26be",
                "key": ":baseball:"
            },
            "basketball": {
                "unicode": "1f3c0",
                "key": ":basketball:"
            },
            "basketball_player": {
                "unicode": "26f9",
                "key": ":basketball_player:"
            },
            "basketball_player_tone1": {
                "unicode": "26f9-1f3fb",
                "key": ":basketball_player_tone1:"
            },
            "basketball_player_tone2": {
                "unicode": "26f9-1f3fc",
                "key": ":basketball_player_tone2:"
            },
            "basketball_player_tone3": {
                "unicode": "26f9-1f3fd",
                "key": ":basketball_player_tone3:"
            },
            "basketball_player_tone4": {
                "unicode": "26f9-1f3fe",
                "key": ":basketball_player_tone4:"
            },
            "basketball_player_tone5": {
                "unicode": "26f9-1f3ff",
                "key": ":basketball_player_tone5:"
            },
            "bat": {
                "unicode": "1f987",
                "key": ":bat:"
            },
            "bath": {
                "unicode": "1f6c0",
                "key": ":bath:"
            },
            "bath_tone1": {
                "unicode": "1f6c0-1f3fb",
                "key": ":bath_tone1:"
            },
            "bath_tone2": {
                "unicode": "1f6c0-1f3fc",
                "key": ":bath_tone2:"
            },
            "bath_tone3": {
                "unicode": "1f6c0-1f3fd",
                "key": ":bath_tone3:"
            },
            "bath_tone4": {
                "unicode": "1f6c0-1f3fe",
                "key": ":bath_tone4:"
            },
            "bath_tone5": {
                "unicode": "1f6c0-1f3ff",
                "key": ":bath_tone5:"
            },
            "bathtub": {
                "unicode": "1f6c1",
                "key": ":bathtub:"
            },
            "battery": {
                "unicode": "1f50b",
                "key": ":battery:"
            },
            "beach": {
                "unicode": "1f3d6",
                "key": ":beach:"
            },
            "beach_umbrella": {
                "unicode": "26f1",
                "key": ":beach_umbrella:"
            },
            "bear": {
                "unicode": "1f43b",
                "key": ":bear:"
            },
            "bed": {
                "unicode": "1f6cf",
                "key": ":bed:"
            },
            "bee": {
                "unicode": "1f41d",
                "key": ":bee:"
            },
            "beer": {
                "unicode": "1f37a",
                "key": ":beer:"
            },
            "beers": {
                "unicode": "1f37b",
                "key": ":beers:"
            },
            "beetle": {
                "unicode": "1f41e",
                "key": ":beetle:"
            },
            "beginner": {
                "unicode": "1f530",
                "key": ":beginner:"
            },
            "bell": {
                "unicode": "1f514",
                "key": ":bell:"
            },
            "bellhop": {
                "unicode": "1f6ce",
                "key": ":bellhop:"
            },
            "bento": {
                "unicode": "1f371",
                "key": ":bento:"
            },
            "bicyclist": {
                "unicode": "1f6b4",
                "key": ":bicyclist:"
            },
            "bicyclist_tone1": {
                "unicode": "1f6b4-1f3fb",
                "key": ":bicyclist_tone1:"
            },
            "bicyclist_tone2": {
                "unicode": "1f6b4-1f3fc",
                "key": ":bicyclist_tone2:"
            },
            "bicyclist_tone3": {
                "unicode": "1f6b4-1f3fd",
                "key": ":bicyclist_tone3:"
            },
            "bicyclist_tone4": {
                "unicode": "1f6b4-1f3fe",
                "key": ":bicyclist_tone4:"
            },
            "bicyclist_tone5": {
                "unicode": "1f6b4-1f3ff",
                "key": ":bicyclist_tone5:"
            },
            "bike": {
                "unicode": "1f6b2",
                "key": ":bike:"
            },
            "bikini": {
                "unicode": "1f459",
                "key": ":bikini:"
            },
            "biohazard": {
                "unicode": "2623",
                "key": ":biohazard:"
            },
            "bird": {
                "unicode": "1f426",
                "key": ":bird:"
            },
            "birthday": {
                "unicode": "1f382",
                "key": ":birthday:"
            },
            "black_circle": {
                "unicode": "26ab",
                "key": ":black_circle:"
            },
            "black_heart": {
                "unicode": "1f5a4",
                "key": ":black_heart:"
            },
            "black_joker": {
                "unicode": "1f0cf",
                "key": ":black_joker:"
            },
            "black_large_square": {
                "unicode": "2b1b",
                "key": ":black_large_square:"
            },
            "black_medium_small_square": {
                "unicode": "25fe",
                "key": ":black_medium_small_square:"
            },
            "black_medium_square": {
                "unicode": "25fc",
                "key": ":black_medium_square:"
            },
            "black_nib": {
                "unicode": "2712",
                "key": ":black_nib:"
            },
            "black_small_square": {
                "unicode": "25aa",
                "key": ":black_small_square:"
            },
            "black_square_button": {
                "unicode": "1f532",
                "key": ":black_square_button:"
            },
            "blossom": {
                "unicode": "1f33c",
                "key": ":blossom:"
            },
            "blowfish": {
                "unicode": "1f421",
                "key": ":blowfish:"
            },
            "blue_book": {
                "unicode": "1f4d8",
                "key": ":blue_book:"
            },
            "blue_car": {
                "unicode": "1f699",
                "key": ":blue_car:"
            },
            "blue_circle": {
                "unicode": "1f535",
                "key": ":blue_circle:"
            },
            "blue_heart": {
                "unicode": "1f499",
                "key": ":blue_heart:"
            },
            "blush": {
                "unicode": "1f60a",
                "key": ":blush:"
            },
            "boar": {
                "unicode": "1f417",
                "key": ":boar:"
            },
            "bomb": {
                "unicode": "1f4a3",
                "key": ":bomb:"
            },
            "book": {
                "unicode": "1f4d6",
                "key": ":book:"
            },
            "bookmark": {
                "unicode": "1f516",
                "key": ":bookmark:"
            },
            "bookmark_tabs": {
                "unicode": "1f4d1",
                "key": ":bookmark_tabs:"
            },
            "books": {
                "unicode": "1f4da",
                "key": ":books:"
            },
            "boom": {
                "unicode": "1f4a5",
                "key": ":boom:"
            },
            "boot": {
                "unicode": "1f462",
                "key": ":boot:"
            },
            "bouquet": {
                "unicode": "1f490",
                "key": ":bouquet:"
            },
            "bow": {
                "unicode": "1f647",
                "key": ":bow:"
            },
            "bow_and_arrow": {
                "unicode": "1f3f9",
                "key": ":bow_and_arrow:"
            },
            "bow_tone1": {
                "unicode": "1f647-1f3fb",
                "key": ":bow_tone1:"
            },
            "bow_tone2": {
                "unicode": "1f647-1f3fc",
                "key": ":bow_tone2:"
            },
            "bow_tone3": {
                "unicode": "1f647-1f3fd",
                "key": ":bow_tone3:"
            },
            "bow_tone4": {
                "unicode": "1f647-1f3fe",
                "key": ":bow_tone4:"
            },
            "bow_tone5": {
                "unicode": "1f647-1f3ff",
                "key": ":bow_tone5:"
            },
            "bowling": {
                "unicode": "1f3b3",
                "key": ":bowling:"
            },
            "boxing_glove": {
                "unicode": "1f94a",
                "key": ":boxing_glove:"
            },
            "boy": {
                "unicode": "1f466",
                "key": ":boy:"
            },
            "boy_tone1": {
                "unicode": "1f466-1f3fb",
                "key": ":boy_tone1:"
            },
            "boy_tone2": {
                "unicode": "1f466-1f3fc",
                "key": ":boy_tone2:"
            },
            "boy_tone3": {
                "unicode": "1f466-1f3fd",
                "key": ":boy_tone3:"
            },
            "boy_tone4": {
                "unicode": "1f466-1f3fe",
                "key": ":boy_tone4:"
            },
            "boy_tone5": {
                "unicode": "1f466-1f3ff",
                "key": ":boy_tone5:"
            },
            "bread": {
                "unicode": "1f35e",
                "key": ":bread:"
            },
            "bride_with_veil": {
                "unicode": "1f470",
                "key": ":bride_with_veil:"
            },
            "bride_with_veil_tone1": {
                "unicode": "1f470-1f3fb",
                "key": ":bride_with_veil_tone1:"
            },
            "bride_with_veil_tone2": {
                "unicode": "1f470-1f3fc",
                "key": ":bride_with_veil_tone2:"
            },
            "bride_with_veil_tone3": {
                "unicode": "1f470-1f3fd",
                "key": ":bride_with_veil_tone3:"
            },
            "bride_with_veil_tone4": {
                "unicode": "1f470-1f3fe",
                "key": ":bride_with_veil_tone4:"
            },
            "bride_with_veil_tone5": {
                "unicode": "1f470-1f3ff",
                "key": ":bride_with_veil_tone5:"
            },
            "bridge_at_night": {
                "unicode": "1f309",
                "key": ":bridge_at_night:"
            },
            "briefcase": {
                "unicode": "1f4bc",
                "key": ":briefcase:"
            },
            "broken_heart": {
                "unicode": "1f494",
                "key": ":broken_heart:"
            },
            "bug": {
                "unicode": "1f41b",
                "key": ":bug:"
            },
            "bulb": {
                "unicode": "1f4a1",
                "key": ":bulb:"
            },
            "bullettrain_front": {
                "unicode": "1f685",
                "key": ":bullettrain_front:"
            },
            "bullettrain_side": {
                "unicode": "1f684",
                "key": ":bullettrain_side:"
            },
            "burrito": {
                "unicode": "1f32f",
                "key": ":burrito:"
            },
            "bus": {
                "unicode": "1f68c",
                "key": ":bus:"
            },
            "busstop": {
                "unicode": "1f68f",
                "key": ":busstop:"
            },
            "bust_in_silhouette": {
                "unicode": "1f464",
                "key": ":bust_in_silhouette:"
            },
            "busts_in_silhouette": {
                "unicode": "1f465",
                "key": ":busts_in_silhouette:"
            },
            "butterfly": {
                "unicode": "1f98b",
                "key": ":butterfly:"
            },
            "cactus": {
                "unicode": "1f335",
                "key": ":cactus:"
            },
            "cake": {
                "unicode": "1f370",
                "key": ":cake:"
            },
            "calendar": {
                "unicode": "1f4c6",
                "key": ":calendar:"
            },
            "calendar_spiral": {
                "unicode": "1f5d3",
                "key": ":calendar_spiral:"
            },
            "call_me": {
                "unicode": "1f919",
                "key": ":call_me:"
            },
            "call_me_tone1": {
                "unicode": "1f919-1f3fb",
                "key": ":call_me_tone1:"
            },
            "call_me_tone2": {
                "unicode": "1f919-1f3fc",
                "key": ":call_me_tone2:"
            },
            "call_me_tone3": {
                "unicode": "1f919-1f3fd",
                "key": ":call_me_tone3:"
            },
            "call_me_tone4": {
                "unicode": "1f919-1f3fe",
                "key": ":call_me_tone4:"
            },
            "call_me_tone5": {
                "unicode": "1f919-1f3ff",
                "key": ":call_me_tone5:"
            },
            "calling": {
                "unicode": "1f4f2",
                "key": ":calling:"
            },
            "camel": {
                "unicode": "1f42b",
                "key": ":camel:"
            },
            "camera": {
                "unicode": "1f4f7",
                "key": ":camera:"
            },
            "camera_with_flash": {
                "unicode": "1f4f8",
                "key": ":camera_with_flash:"
            },
            "camping": {
                "unicode": "1f3d5",
                "key": ":camping:"
            },
            "cancer": {
                "unicode": "264b",
                "key": ":cancer:"
            },
            "candle": {
                "unicode": "1f56f",
                "key": ":candle:"
            },
            "candy": {
                "unicode": "1f36c",
                "key": ":candy:"
            },
            "canoe": {
                "unicode": "1f6f6",
                "key": ":canoe:"
            },
            "capital_abcd": {
                "unicode": "1f520",
                "key": ":capital_abcd:"
            },
            "capricorn": {
                "unicode": "2651",
                "key": ":capricorn:"
            },
            "card_box": {
                "unicode": "1f5c3",
                "key": ":card_box:"
            },
            "card_index": {
                "unicode": "1f4c7",
                "key": ":card_index:"
            },
            "carousel_horse": {
                "unicode": "1f3a0",
                "key": ":carousel_horse:"
            },
            "carrot": {
                "unicode": "1f955",
                "key": ":carrot:"
            },
            "cartwheel": {
                "unicode": "1f938",
                "key": ":cartwheel:"
            },
            "cartwheel_tone1": {
                "unicode": "1f938-1f3fb",
                "key": ":cartwheel_tone1:"
            },
            "cartwheel_tone2": {
                "unicode": "1f938-1f3fc",
                "key": ":cartwheel_tone2:"
            },
            "cartwheel_tone3": {
                "unicode": "1f938-1f3fd",
                "key": ":cartwheel_tone3:"
            },
            "cartwheel_tone4": {
                "unicode": "1f938-1f3fe",
                "key": ":cartwheel_tone4:"
            },
            "cartwheel_tone5": {
                "unicode": "1f938-1f3ff",
                "key": ":cartwheel_tone5:"
            },
            "cat": {
                "unicode": "1f431",
                "key": ":cat:"
            },
            "cat2": {
                "unicode": "1f408",
                "key": ":cat2:"
            },
            "cd": {
                "unicode": "1f4bf",
                "key": ":cd:"
            },
            "chains": {
                "unicode": "26d3",
                "key": ":chains:"
            },
            "champagne": {
                "unicode": "1f37e",
                "key": ":champagne:"
            },
            "champagne_glass": {
                "unicode": "1f942",
                "key": ":champagne_glass:"
            },
            "chart": {
                "unicode": "1f4b9",
                "key": ":chart:"
            },
            "chart_with_downwards_trend": {
                "unicode": "1f4c9",
                "key": ":chart_with_downwards_trend:"
            },
            "chart_with_upwards_trend": {
                "unicode": "1f4c8",
                "key": ":chart_with_upwards_trend:"
            },
            "checkered_flag": {
                "unicode": "1f3c1",
                "key": ":checkered_flag:"
            },
            "cheese": {
                "unicode": "1f9c0",
                "key": ":cheese:"
            },
            "cherries": {
                "unicode": "1f352",
                "key": ":cherries:"
            },
            "cherry_blossom": {
                "unicode": "1f338",
                "key": ":cherry_blossom:"
            },
            "chestnut": {
                "unicode": "1f330",
                "key": ":chestnut:"
            },
            "chicken": {
                "unicode": "1f414",
                "key": ":chicken:"
            },
            "children_crossing": {
                "unicode": "1f6b8",
                "key": ":children_crossing:"
            },
            "chipmunk": {
                "unicode": "1f43f",
                "key": ":chipmunk:"
            },
            "chocolate_bar": {
                "unicode": "1f36b",
                "key": ":chocolate_bar:"
            },
            "christmas_tree": {
                "unicode": "1f384",
                "key": ":christmas_tree:"
            },
            "church": {
                "unicode": "26ea",
                "key": ":church:"
            },
            "cinema": {
                "unicode": "1f3a6",
                "key": ":cinema:"
            },
            "circus_tent": {
                "unicode": "1f3aa",
                "key": ":circus_tent:"
            },
            "city_dusk": {
                "unicode": "1f306",
                "key": ":city_dusk:"
            },
            "city_sunset": {
                "unicode": "1f307",
                "key": ":city_sunset:"
            },
            "cityscape": {
                "unicode": "1f3d9",
                "key": ":cityscape:"
            },
            "cl": {
                "unicode": "1f191",
                "key": ":cl:"
            },
            "clap": {
                "unicode": "1f44f",
                "key": ":clap:"
            },
            "clap_tone1": {
                "unicode": "1f44f-1f3fb",
                "key": ":clap_tone1:"
            },
            "clap_tone2": {
                "unicode": "1f44f-1f3fc",
                "key": ":clap_tone2:"
            },
            "clap_tone3": {
                "unicode": "1f44f-1f3fd",
                "key": ":clap_tone3:"
            },
            "clap_tone4": {
                "unicode": "1f44f-1f3fe",
                "key": ":clap_tone4:"
            },
            "clap_tone5": {
                "unicode": "1f44f-1f3ff",
                "key": ":clap_tone5:"
            },
            "clapper": {
                "unicode": "1f3ac",
                "key": ":clapper:"
            },
            "classical_building": {
                "unicode": "1f3db",
                "key": ":classical_building:"
            },
            "clipboard": {
                "unicode": "1f4cb",
                "key": ":clipboard:"
            },
            "clock": {
                "unicode": "1f570",
                "key": ":clock:"
            },
            "clock1": {
                "unicode": "1f550",
                "key": ":clock1:"
            },
            "clock10": {
                "unicode": "1f559",
                "key": ":clock10:"
            },
            "clock1030": {
                "unicode": "1f565",
                "key": ":clock1030:"
            },
            "clock11": {
                "unicode": "1f55a",
                "key": ":clock11:"
            },
            "clock1130": {
                "unicode": "1f566",
                "key": ":clock1130:"
            },
            "clock12": {
                "unicode": "1f55b",
                "key": ":clock12:"
            },
            "clock1230": {
                "unicode": "1f567",
                "key": ":clock1230:"
            },
            "clock130": {
                "unicode": "1f55c",
                "key": ":clock130:"
            },
            "clock2": {
                "unicode": "1f551",
                "key": ":clock2:"
            },
            "clock230": {
                "unicode": "1f55d",
                "key": ":clock230:"
            },
            "clock3": {
                "unicode": "1f552",
                "key": ":clock3:"
            },
            "clock330": {
                "unicode": "1f55e",
                "key": ":clock330:"
            },
            "clock4": {
                "unicode": "1f553",
                "key": ":clock4:"
            },
            "clock430": {
                "unicode": "1f55f",
                "key": ":clock430:"
            },
            "clock5": {
                "unicode": "1f554",
                "key": ":clock5:"
            },
            "clock530": {
                "unicode": "1f560",
                "key": ":clock530:"
            },
            "clock6": {
                "unicode": "1f555",
                "key": ":clock6:"
            },
            "clock630": {
                "unicode": "1f561",
                "key": ":clock630:"
            },
            "clock7": {
                "unicode": "1f556",
                "key": ":clock7:"
            },
            "clock730": {
                "unicode": "1f562",
                "key": ":clock730:"
            },
            "clock8": {
                "unicode": "1f557",
                "key": ":clock8:"
            },
            "clock830": {
                "unicode": "1f563",
                "key": ":clock830:"
            },
            "clock9": {
                "unicode": "1f558",
                "key": ":clock9:"
            },
            "clock930": {
                "unicode": "1f564",
                "key": ":clock930:"
            },
            "closed_book": {
                "unicode": "1f4d5",
                "key": ":closed_book:"
            },
            "closed_lock_with_key": {
                "unicode": "1f510",
                "key": ":closed_lock_with_key:"
            },
            "closed_umbrella": {
                "unicode": "1f302",
                "key": ":closed_umbrella:"
            },
            "cloud": {
                "unicode": "2601",
                "key": ":cloud:"
            },
            "cloud_lightning": {
                "unicode": "1f329",
                "key": ":cloud_lightning:"
            },
            "cloud_rain": {
                "unicode": "1f327",
                "key": ":cloud_rain:"
            },
            "cloud_snow": {
                "unicode": "1f328",
                "key": ":cloud_snow:"
            },
            "cloud_tornado": {
                "unicode": "1f32a",
                "key": ":cloud_tornado:"
            },
            "clown": {
                "unicode": "1f921",
                "key": ":clown:"
            },
            "clubs": {
                "unicode": "2663",
                "key": ":clubs:"
            },
            "cocktail": {
                "unicode": "1f378",
                "key": ":cocktail:"
            },
            "coffee": {
                "unicode": "2615",
                "key": ":coffee:"
            },
            "coffin": {
                "unicode": "26b0",
                "key": ":coffin:"
            },
            "cold_sweat": {
                "unicode": "1f630",
                "key": ":cold_sweat:"
            },
            "comet": {
                "unicode": "2604",
                "key": ":comet:"
            },
            "compression": {
                "unicode": "1f5dc",
                "key": ":compression:"
            },
            "computer": {
                "unicode": "1f4bb",
                "key": ":computer:"
            },
            "confetti_ball": {
                "unicode": "1f38a",
                "key": ":confetti_ball:"
            },
            "confounded": {
                "unicode": "1f616",
                "key": ":confounded:"
            },
            "confused": {
                "unicode": "1f615",
                "key": ":confused:"
            },
            "congratulations": {
                "unicode": "3297",
                "key": ":congratulations:"
            },
            "construction": {
                "unicode": "1f6a7",
                "key": ":construction:"
            },
            "construction_site": {
                "unicode": "1f3d7",
                "key": ":construction_site:"
            },
            "construction_worker": {
                "unicode": "1f477",
                "key": ":construction_worker:"
            },
            "construction_worker_tone1": {
                "unicode": "1f477-1f3fb",
                "key": ":construction_worker_tone1:"
            },
            "construction_worker_tone2": {
                "unicode": "1f477-1f3fc",
                "key": ":construction_worker_tone2:"
            },
            "construction_worker_tone3": {
                "unicode": "1f477-1f3fd",
                "key": ":construction_worker_tone3:"
            },
            "construction_worker_tone4": {
                "unicode": "1f477-1f3fe",
                "key": ":construction_worker_tone4:"
            },
            "construction_worker_tone5": {
                "unicode": "1f477-1f3ff",
                "key": ":construction_worker_tone5:"
            },
            "control_knobs": {
                "unicode": "1f39b",
                "key": ":control_knobs:"
            },
            "convenience_store": {
                "unicode": "1f3ea",
                "key": ":convenience_store:"
            },
            "cookie": {
                "unicode": "1f36a",
                "key": ":cookie:"
            },
            "cooking": {
                "unicode": "1f373",
                "key": ":cooking:"
            },
            "cool": {
                "unicode": "1f192",
                "key": ":cool:"
            },
            "cop": {
                "unicode": "1f46e",
                "key": ":cop:"
            },
            "cop_tone1": {
                "unicode": "1f46e-1f3fb",
                "key": ":cop_tone1:"
            },
            "cop_tone2": {
                "unicode": "1f46e-1f3fc",
                "key": ":cop_tone2:"
            },
            "cop_tone3": {
                "unicode": "1f46e-1f3fd",
                "key": ":cop_tone3:"
            },
            "cop_tone4": {
                "unicode": "1f46e-1f3fe",
                "key": ":cop_tone4:"
            },
            "cop_tone5": {
                "unicode": "1f46e-1f3ff",
                "key": ":cop_tone5:"
            },
            "copyright": {
                "unicode": "00a9",
                "key": ":copyright:"
            },
            "corn": {
                "unicode": "1f33d",
                "key": ":corn:"
            },
            "couch": {
                "unicode": "1f6cb",
                "key": ":couch:"
            },
            "couple": {
                "unicode": "1f46b",
                "key": ":couple:"
            },
            "couple_mm": {
                "unicode": "1f468-2764-1f468",
                "key": ":couple_mm:"
            },
            "couple_with_heart": {
                "unicode": "1f491",
                "key": ":couple_with_heart:"
            },
            "couple_ww": {
                "unicode": "1f469-2764-1f469",
                "key": ":couple_ww:"
            },
            "couplekiss": {
                "unicode": "1f48f",
                "key": ":couplekiss:"
            },
            "cow": {
                "unicode": "1f42e",
                "key": ":cow:"
            },
            "cow2": {
                "unicode": "1f404",
                "key": ":cow2:"
            },
            "cowboy": {
                "unicode": "1f920",
                "key": ":cowboy:"
            },
            "crab": {
                "unicode": "1f980",
                "key": ":crab:"
            },
            "crayon": {
                "unicode": "1f58d",
                "key": ":crayon:"
            },
            "credit_card": {
                "unicode": "1f4b3",
                "key": ":credit_card:"
            },
            "crescent_moon": {
                "unicode": "1f319",
                "key": ":crescent_moon:"
            },
            "cricket": {
                "unicode": "1f3cf",
                "key": ":cricket:"
            },
            "crocodile": {
                "unicode": "1f40a",
                "key": ":crocodile:"
            },
            "croissant": {
                "unicode": "1f950",
                "key": ":croissant:"
            },
            "cross": {
                "unicode": "271d",
                "key": ":cross:"
            },
            "crossed_flags": {
                "unicode": "1f38c",
                "key": ":crossed_flags:"
            },
            "crossed_swords": {
                "unicode": "2694",
                "key": ":crossed_swords:"
            },
            "crown": {
                "unicode": "1f451",
                "key": ":crown:"
            },
            "cruise_ship": {
                "unicode": "1f6f3",
                "key": ":cruise_ship:"
            },
            "cry": {
                "unicode": "1f622",
                "key": ":cry:"
            },
            "crying_cat_face": {
                "unicode": "1f63f",
                "key": ":crying_cat_face:"
            },
            "crystal_ball": {
                "unicode": "1f52e",
                "key": ":crystal_ball:"
            },
            "cucumber": {
                "unicode": "1f952",
                "key": ":cucumber:"
            },
            "cupid": {
                "unicode": "1f498",
                "key": ":cupid:"
            },
            "curly_loop": {
                "unicode": "27b0",
                "key": ":curly_loop:"
            },
            "currency_exchange": {
                "unicode": "1f4b1",
                "key": ":currency_exchange:"
            },
            "curry": {
                "unicode": "1f35b",
                "key": ":curry:"
            },
            "custard": {
                "unicode": "1f36e",
                "key": ":custard:"
            },
            "customs": {
                "unicode": "1f6c3",
                "key": ":customs:"
            },
            "cyclone": {
                "unicode": "1f300",
                "key": ":cyclone:"
            },
            "dagger": {
                "unicode": "1f5e1",
                "key": ":dagger:"
            },
            "dancer": {
                "unicode": "1f483",
                "key": ":dancer:"
            },
            "dancer_tone1": {
                "unicode": "1f483-1f3fb",
                "key": ":dancer_tone1:"
            },
            "dancer_tone2": {
                "unicode": "1f483-1f3fc",
                "key": ":dancer_tone2:"
            },
            "dancer_tone3": {
                "unicode": "1f483-1f3fd",
                "key": ":dancer_tone3:"
            },
            "dancer_tone4": {
                "unicode": "1f483-1f3fe",
                "key": ":dancer_tone4:"
            },
            "dancer_tone5": {
                "unicode": "1f483-1f3ff",
                "key": ":dancer_tone5:"
            },
            "dancers": {
                "unicode": "1f46f",
                "key": ":dancers:"
            },
            "dango": {
                "unicode": "1f361",
                "key": ":dango:"
            },
            "dark_sunglasses": {
                "unicode": "1f576",
                "key": ":dark_sunglasses:"
            },
            "dart": {
                "unicode": "1f3af",
                "key": ":dart:"
            },
            "dash": {
                "unicode": "1f4a8",
                "key": ":dash:"
            },
            "date": {
                "unicode": "1f4c5",
                "key": ":date:"
            },
            "deciduous_tree": {
                "unicode": "1f333",
                "key": ":deciduous_tree:"
            },
            "deer": {
                "unicode": "1f98c",
                "key": ":deer:"
            },
            "department_store": {
                "unicode": "1f3ec",
                "key": ":department_store:"
            },
            "desert": {
                "unicode": "1f3dc",
                "key": ":desert:"
            },
            "desktop": {
                "unicode": "1f5a5",
                "key": ":desktop:"
            },
            "diamond_shape_with_a_dot_inside": {
                "unicode": "1f4a0",
                "key": ":diamond_shape_with_a_dot_inside:"
            },
            "diamonds": {
                "unicode": "2666",
                "key": ":diamonds:"
            },
            "disappointed": {
                "unicode": "1f61e",
                "key": ":disappointed:"
            },
            "disappointed_relieved": {
                "unicode": "1f625",
                "key": ":disappointed_relieved:"
            },
            "dividers": {
                "unicode": "1f5c2",
                "key": ":dividers:"
            },
            "dizzy": {
                "unicode": "1f4ab",
                "key": ":dizzy:"
            },
            "dizzy_face": {
                "unicode": "1f635",
                "key": ":dizzy_face:"
            },
            "do_not_litter": {
                "unicode": "1f6af",
                "key": ":do_not_litter:"
            },
            "dog": {
                "unicode": "1f436",
                "key": ":dog:"
            },
            "dog2": {
                "unicode": "1f415",
                "key": ":dog2:"
            },
            "dollar": {
                "unicode": "1f4b5",
                "key": ":dollar:"
            },
            "dolls": {
                "unicode": "1f38e",
                "key": ":dolls:"
            },
            "dolphin": {
                "unicode": "1f42c",
                "key": ":dolphin:"
            },
            "door": {
                "unicode": "1f6aa",
                "key": ":door:"
            },
            "doughnut": {
                "unicode": "1f369",
                "key": ":doughnut:"
            },
            "dove": {
                "unicode": "1f54a",
                "key": ":dove:"
            },
            "dragon": {
                "unicode": "1f409",
                "key": ":dragon:"
            },
            "dragon_face": {
                "unicode": "1f432",
                "key": ":dragon_face:"
            },
            "dress": {
                "unicode": "1f457",
                "key": ":dress:"
            },
            "dromedary_camel": {
                "unicode": "1f42a",
                "key": ":dromedary_camel:"
            },
            "drooling_face": {
                "unicode": "1f924",
                "key": ":drooling_face:"
            },
            "droplet": {
                "unicode": "1f4a7",
                "key": ":droplet:"
            },
            "drum": {
                "unicode": "1f941",
                "key": ":drum:"
            },
            "duck": {
                "unicode": "1f986",
                "key": ":duck:"
            },
            "dvd": {
                "unicode": "1f4c0",
                "key": ":dvd:"
            },
            "e-mail": {
                "unicode": "1f4e7",
                "key": ":e-mail:"
            },
            "eagle": {
                "unicode": "1f985",
                "key": ":eagle:"
            },
            "ear": {
                "unicode": "1f442",
                "key": ":ear:"
            },
            "ear_of_rice": {
                "unicode": "1f33e",
                "key": ":ear_of_rice:"
            },
            "ear_tone1": {
                "unicode": "1f442-1f3fb",
                "key": ":ear_tone1:"
            },
            "ear_tone2": {
                "unicode": "1f442-1f3fc",
                "key": ":ear_tone2:"
            },
            "ear_tone3": {
                "unicode": "1f442-1f3fd",
                "key": ":ear_tone3:"
            },
            "ear_tone4": {
                "unicode": "1f442-1f3fe",
                "key": ":ear_tone4:"
            },
            "ear_tone5": {
                "unicode": "1f442-1f3ff",
                "key": ":ear_tone5:"
            },
            "earth_africa": {
                "unicode": "1f30d",
                "key": ":earth_africa:"
            },
            "earth_americas": {
                "unicode": "1f30e",
                "key": ":earth_americas:"
            },
            "earth_asia": {
                "unicode": "1f30f",
                "key": ":earth_asia:"
            },
            "egg": {
                "unicode": "1f95a",
                "key": ":egg:"
            },
            "eggplant": {
                "unicode": "1f346",
                "key": ":eggplant:"
            },
            "eight": {
                "unicode": "0038-20e3",
                "key": ":eight:"
            },
            "eight_pointed_black_star": {
                "unicode": "2734",
                "key": ":eight_pointed_black_star:"
            },
            "eight_spoked_asterisk": {
                "unicode": "2733",
                "key": ":eight_spoked_asterisk:"
            },
            "eject": {
                "unicode": "23cf",
                "key": ":eject:"
            },
            "electric_plug": {
                "unicode": "1f50c",
                "key": ":electric_plug:"
            },
            "elephant": {
                "unicode": "1f418",
                "key": ":elephant:"
            },
            "end": {
                "unicode": "1f51a",
                "key": ":end:"
            },
            "envelope": {
                "unicode": "2709",
                "key": ":envelope:"
            },
            "envelope_with_arrow": {
                "unicode": "1f4e9",
                "key": ":envelope_with_arrow:"
            },
            "euro": {
                "unicode": "1f4b6",
                "key": ":euro:"
            },
            "european_castle": {
                "unicode": "1f3f0",
                "key": ":european_castle:"
            },
            "european_post_office": {
                "unicode": "1f3e4",
                "key": ":european_post_office:"
            },
            "evergreen_tree": {
                "unicode": "1f332",
                "key": ":evergreen_tree:"
            },
            "exclamation": {
                "unicode": "2757",
                "key": ":exclamation:"
            },
            "expressionless": {
                "unicode": "1f611",
                "key": ":expressionless:"
            },
            "eye": {
                "unicode": "1f441",
                "key": ":eye:"
            },
            "eye_in_speech_bubble": {
                "unicode": "1f441-1f5e8",
                "key": ":eye_in_speech_bubble:"
            },
            "eyeglasses": {
                "unicode": "1f453",
                "key": ":eyeglasses:"
            },
            "eyes": {
                "unicode": "1f440",
                "key": ":eyes:"
            },
            "face_palm": {
                "unicode": "1f926",
                "key": ":face_palm:"
            },
            "face_palm_tone1": {
                "unicode": "1f926-1f3fb",
                "key": ":face_palm_tone1:"
            },
            "face_palm_tone2": {
                "unicode": "1f926-1f3fc",
                "key": ":face_palm_tone2:"
            },
            "face_palm_tone3": {
                "unicode": "1f926-1f3fd",
                "key": ":face_palm_tone3:"
            },
            "face_palm_tone4": {
                "unicode": "1f926-1f3fe",
                "key": ":face_palm_tone4:"
            },
            "face_palm_tone5": {
                "unicode": "1f926-1f3ff",
                "key": ":face_palm_tone5:"
            },
            "factory": {
                "unicode": "1f3ed",
                "key": ":factory:"
            },
            "fallen_leaf": {
                "unicode": "1f342",
                "key": ":fallen_leaf:"
            },
            "family": {
                "unicode": "1f46a",
                "key": ":family:"
            },
            "family_mmb": {
                "unicode": "1f468-1f468-1f466",
                "key": ":family_mmb:"
            },
            "family_mmbb": {
                "unicode": "1f468-1f468-1f466-1f466",
                "key": ":family_mmbb:"
            },
            "family_mmg": {
                "unicode": "1f468-1f468-1f467",
                "key": ":family_mmg:"
            },
            "family_mmgb": {
                "unicode": "1f468-1f468-1f467-1f466",
                "key": ":family_mmgb:"
            },
            "family_mmgg": {
                "unicode": "1f468-1f468-1f467-1f467",
                "key": ":family_mmgg:"
            },
            "family_mwbb": {
                "unicode": "1f468-1f469-1f466-1f466",
                "key": ":family_mwbb:"
            },
            "family_mwg": {
                "unicode": "1f468-1f469-1f467",
                "key": ":family_mwg:"
            },
            "family_mwgb": {
                "unicode": "1f468-1f469-1f467-1f466",
                "key": ":family_mwgb:"
            },
            "family_mwgg": {
                "unicode": "1f468-1f469-1f467-1f467",
                "key": ":family_mwgg:"
            },
            "family_wwb": {
                "unicode": "1f469-1f469-1f466",
                "key": ":family_wwb:"
            },
            "family_wwbb": {
                "unicode": "1f469-1f469-1f466-1f466",
                "key": ":family_wwbb:"
            },
            "family_wwg": {
                "unicode": "1f469-1f469-1f467",
                "key": ":family_wwg:"
            },
            "family_wwgb": {
                "unicode": "1f469-1f469-1f467-1f466",
                "key": ":family_wwgb:"
            },
            "family_wwgg": {
                "unicode": "1f469-1f469-1f467-1f467",
                "key": ":family_wwgg:"
            },
            "fast_forward": {
                "unicode": "23e9",
                "key": ":fast_forward:"
            },
            "fax": {
                "unicode": "1f4e0",
                "key": ":fax:"
            },
            "fearful": {
                "unicode": "1f628",
                "key": ":fearful:"
            },
            "feet": {
                "unicode": "1f43e",
                "key": ":feet:"
            },
            "fencer": {
                "unicode": "1f93a",
                "key": ":fencer:"
            },
            "ferris_wheel": {
                "unicode": "1f3a1",
                "key": ":ferris_wheel:"
            },
            "ferry": {
                "unicode": "26f4",
                "key": ":ferry:"
            },
            "field_hockey": {
                "unicode": "1f3d1",
                "key": ":field_hockey:"
            },
            "file_cabinet": {
                "unicode": "1f5c4",
                "key": ":file_cabinet:"
            },
            "file_folder": {
                "unicode": "1f4c1",
                "key": ":file_folder:"
            },
            "film_frames": {
                "unicode": "1f39e",
                "key": ":film_frames:"
            },
            "fingers_crossed": {
                "unicode": "1f91e",
                "key": ":fingers_crossed:"
            },
            "fingers_crossed_tone1": {
                "unicode": "1f91e-1f3fb",
                "key": ":fingers_crossed_tone1:"
            },
            "fingers_crossed_tone2": {
                "unicode": "1f91e-1f3fc",
                "key": ":fingers_crossed_tone2:"
            },
            "fingers_crossed_tone3": {
                "unicode": "1f91e-1f3fd",
                "key": ":fingers_crossed_tone3:"
            },
            "fingers_crossed_tone4": {
                "unicode": "1f91e-1f3fe",
                "key": ":fingers_crossed_tone4:"
            },
            "fingers_crossed_tone5": {
                "unicode": "1f91e-1f3ff",
                "key": ":fingers_crossed_tone5:"
            },
            "fire": {
                "unicode": "1f525",
                "key": ":fire:"
            },
            "fire_engine": {
                "unicode": "1f692",
                "key": ":fire_engine:"
            },
            "fireworks": {
                "unicode": "1f386",
                "key": ":fireworks:"
            },
            "first_place": {
                "unicode": "1f947",
                "key": ":first_place:"
            },
            "first_quarter_moon": {
                "unicode": "1f313",
                "key": ":first_quarter_moon:"
            },
            "first_quarter_moon_with_face": {
                "unicode": "1f31b",
                "key": ":first_quarter_moon_with_face:"
            },
            "fish": {
                "unicode": "1f41f",
                "key": ":fish:"
            },
            "fish_cake": {
                "unicode": "1f365",
                "key": ":fish_cake:"
            },
            "fishing_pole_and_fish": {
                "unicode": "1f3a3",
                "key": ":fishing_pole_and_fish:"
            },
            "fist": {
                "unicode": "270a",
                "key": ":fist:"
            },
            "fist_tone1": {
                "unicode": "270a-1f3fb",
                "key": ":fist_tone1:"
            },
            "fist_tone2": {
                "unicode": "270a-1f3fc",
                "key": ":fist_tone2:"
            },
            "fist_tone3": {
                "unicode": "270a-1f3fd",
                "key": ":fist_tone3:"
            },
            "fist_tone4": {
                "unicode": "270a-1f3fe",
                "key": ":fist_tone4:"
            },
            "fist_tone5": {
                "unicode": "270a-1f3ff",
                "key": ":fist_tone5:"
            },
            "five": {
                "unicode": "0035-20e3",
                "key": ":five:"
            },
            "flag_ac": {
                "unicode": "1f1e6-1f1e8",
                "key": ":flag_ac:"
            },
            "flag_ad": {
                "unicode": "1f1e6-1f1e9",
                "key": ":flag_ad:"
            },
            "flag_ae": {
                "unicode": "1f1e6-1f1ea",
                "key": ":flag_ae:"
            },
            "flag_af": {
                "unicode": "1f1e6-1f1eb",
                "key": ":flag_af:"
            },
            "flag_ag": {
                "unicode": "1f1e6-1f1ec",
                "key": ":flag_ag:"
            },
            "flag_ai": {
                "unicode": "1f1e6-1f1ee",
                "key": ":flag_ai:"
            },
            "flag_al": {
                "unicode": "1f1e6-1f1f1",
                "key": ":flag_al:"
            },
            "flag_am": {
                "unicode": "1f1e6-1f1f2",
                "key": ":flag_am:"
            },
            "flag_ao": {
                "unicode": "1f1e6-1f1f4",
                "key": ":flag_ao:"
            },
            "flag_aq": {
                "unicode": "1f1e6-1f1f6",
                "key": ":flag_aq:"
            },
            "flag_ar": {
                "unicode": "1f1e6-1f1f7",
                "key": ":flag_ar:"
            },
            "flag_as": {
                "unicode": "1f1e6-1f1f8",
                "key": ":flag_as:"
            },
            "flag_at": {
                "unicode": "1f1e6-1f1f9",
                "key": ":flag_at:"
            },
            "flag_au": {
                "unicode": "1f1e6-1f1fa",
                "key": ":flag_au:"
            },
            "flag_aw": {
                "unicode": "1f1e6-1f1fc",
                "key": ":flag_aw:"
            },
            "flag_ax": {
                "unicode": "1f1e6-1f1fd",
                "key": ":flag_ax:"
            },
            "flag_az": {
                "unicode": "1f1e6-1f1ff",
                "key": ":flag_az:"
            },
            "flag_ba": {
                "unicode": "1f1e7-1f1e6",
                "key": ":flag_ba:"
            },
            "flag_bb": {
                "unicode": "1f1e7-1f1e7",
                "key": ":flag_bb:"
            },
            "flag_bd": {
                "unicode": "1f1e7-1f1e9",
                "key": ":flag_bd:"
            },
            "flag_be": {
                "unicode": "1f1e7-1f1ea",
                "key": ":flag_be:"
            },
            "flag_bf": {
                "unicode": "1f1e7-1f1eb",
                "key": ":flag_bf:"
            },
            "flag_bg": {
                "unicode": "1f1e7-1f1ec",
                "key": ":flag_bg:"
            },
            "flag_bh": {
                "unicode": "1f1e7-1f1ed",
                "key": ":flag_bh:"
            },
            "flag_bi": {
                "unicode": "1f1e7-1f1ee",
                "key": ":flag_bi:"
            },
            "flag_bj": {
                "unicode": "1f1e7-1f1ef",
                "key": ":flag_bj:"
            },
            "flag_bl": {
                "unicode": "1f1e7-1f1f1",
                "key": ":flag_bl:"
            },
            "flag_black": {
                "unicode": "1f3f4",
                "key": ":flag_black:"
            },
            "flag_bm": {
                "unicode": "1f1e7-1f1f2",
                "key": ":flag_bm:"
            },
            "flag_bn": {
                "unicode": "1f1e7-1f1f3",
                "key": ":flag_bn:"
            },
            "flag_bo": {
                "unicode": "1f1e7-1f1f4",
                "key": ":flag_bo:"
            },
            "flag_bq": {
                "unicode": "1f1e7-1f1f6",
                "key": ":flag_bq:"
            },
            "flag_br": {
                "unicode": "1f1e7-1f1f7",
                "key": ":flag_br:"
            },
            "flag_bs": {
                "unicode": "1f1e7-1f1f8",
                "key": ":flag_bs:"
            },
            "flag_bt": {
                "unicode": "1f1e7-1f1f9",
                "key": ":flag_bt:"
            },
            "flag_bv": {
                "unicode": "1f1e7-1f1fb",
                "key": ":flag_bv:"
            },
            "flag_bw": {
                "unicode": "1f1e7-1f1fc",
                "key": ":flag_bw:"
            },
            "flag_by": {
                "unicode": "1f1e7-1f1fe",
                "key": ":flag_by:"
            },
            "flag_bz": {
                "unicode": "1f1e7-1f1ff",
                "key": ":flag_bz:"
            },
            "flag_ca": {
                "unicode": "1f1e8-1f1e6",
                "key": ":flag_ca:"
            },
            "flag_cc": {
                "unicode": "1f1e8-1f1e8",
                "key": ":flag_cc:"
            },
            "flag_cd": {
                "unicode": "1f1e8-1f1e9",
                "key": ":flag_cd:"
            },
            "flag_cf": {
                "unicode": "1f1e8-1f1eb",
                "key": ":flag_cf:"
            },
            "flag_cg": {
                "unicode": "1f1e8-1f1ec",
                "key": ":flag_cg:"
            },
            "flag_ch": {
                "unicode": "1f1e8-1f1ed",
                "key": ":flag_ch:"
            },
            "flag_ci": {
                "unicode": "1f1e8-1f1ee",
                "key": ":flag_ci:"
            },
            "flag_ck": {
                "unicode": "1f1e8-1f1f0",
                "key": ":flag_ck:"
            },
            "flag_cl": {
                "unicode": "1f1e8-1f1f1",
                "key": ":flag_cl:"
            },
            "flag_cm": {
                "unicode": "1f1e8-1f1f2",
                "key": ":flag_cm:"
            },
            "flag_cn": {
                "unicode": "1f1e8-1f1f3",
                "key": ":flag_cn:"
            },
            "flag_co": {
                "unicode": "1f1e8-1f1f4",
                "key": ":flag_co:"
            },
            "flag_cp": {
                "unicode": "1f1e8-1f1f5",
                "key": ":flag_cp:"
            },
            "flag_cr": {
                "unicode": "1f1e8-1f1f7",
                "key": ":flag_cr:"
            },
            "flag_cu": {
                "unicode": "1f1e8-1f1fa",
                "key": ":flag_cu:"
            },
            "flag_cv": {
                "unicode": "1f1e8-1f1fb",
                "key": ":flag_cv:"
            },
            "flag_cw": {
                "unicode": "1f1e8-1f1fc",
                "key": ":flag_cw:"
            },
            "flag_cx": {
                "unicode": "1f1e8-1f1fd",
                "key": ":flag_cx:"
            },
            "flag_cy": {
                "unicode": "1f1e8-1f1fe",
                "key": ":flag_cy:"
            },
            "flag_cz": {
                "unicode": "1f1e8-1f1ff",
                "key": ":flag_cz:"
            },
            "flag_de": {
                "unicode": "1f1e9-1f1ea",
                "key": ":flag_de:"
            },
            "flag_dg": {
                "unicode": "1f1e9-1f1ec",
                "key": ":flag_dg:"
            },
            "flag_dj": {
                "unicode": "1f1e9-1f1ef",
                "key": ":flag_dj:"
            },
            "flag_dk": {
                "unicode": "1f1e9-1f1f0",
                "key": ":flag_dk:"
            },
            "flag_dm": {
                "unicode": "1f1e9-1f1f2",
                "key": ":flag_dm:"
            },
            "flag_do": {
                "unicode": "1f1e9-1f1f4",
                "key": ":flag_do:"
            },
            "flag_dz": {
                "unicode": "1f1e9-1f1ff",
                "key": ":flag_dz:"
            },
            "flag_ea": {
                "unicode": "1f1ea-1f1e6",
                "key": ":flag_ea:"
            },
            "flag_ec": {
                "unicode": "1f1ea-1f1e8",
                "key": ":flag_ec:"
            },
            "flag_ee": {
                "unicode": "1f1ea-1f1ea",
                "key": ":flag_ee:"
            },
            "flag_eg": {
                "unicode": "1f1ea-1f1ec",
                "key": ":flag_eg:"
            },
            "flag_eh": {
                "unicode": "1f1ea-1f1ed",
                "key": ":flag_eh:"
            },
            "flag_er": {
                "unicode": "1f1ea-1f1f7",
                "key": ":flag_er:"
            },
            "flag_es": {
                "unicode": "1f1ea-1f1f8",
                "key": ":flag_es:"
            },
            "flag_et": {
                "unicode": "1f1ea-1f1f9",
                "key": ":flag_et:"
            },
            "flag_eu": {
                "unicode": "1f1ea-1f1fa",
                "key": ":flag_eu:"
            },
            "flag_fi": {
                "unicode": "1f1eb-1f1ee",
                "key": ":flag_fi:"
            },
            "flag_fj": {
                "unicode": "1f1eb-1f1ef",
                "key": ":flag_fj:"
            },
            "flag_fk": {
                "unicode": "1f1eb-1f1f0",
                "key": ":flag_fk:"
            },
            "flag_fm": {
                "unicode": "1f1eb-1f1f2",
                "key": ":flag_fm:"
            },
            "flag_fo": {
                "unicode": "1f1eb-1f1f4",
                "key": ":flag_fo:"
            },
            "flag_fr": {
                "unicode": "1f1eb-1f1f7",
                "key": ":flag_fr:"
            },
            "flag_ga": {
                "unicode": "1f1ec-1f1e6",
                "key": ":flag_ga:"
            },
            "flag_gb": {
                "unicode": "1f1ec-1f1e7",
                "key": ":flag_gb:"
            },
            "flag_gd": {
                "unicode": "1f1ec-1f1e9",
                "key": ":flag_gd:"
            },
            "flag_ge": {
                "unicode": "1f1ec-1f1ea",
                "key": ":flag_ge:"
            },
            "flag_gf": {
                "unicode": "1f1ec-1f1eb",
                "key": ":flag_gf:"
            },
            "flag_gg": {
                "unicode": "1f1ec-1f1ec",
                "key": ":flag_gg:"
            },
            "flag_gh": {
                "unicode": "1f1ec-1f1ed",
                "key": ":flag_gh:"
            },
            "flag_gi": {
                "unicode": "1f1ec-1f1ee",
                "key": ":flag_gi:"
            },
            "flag_gl": {
                "unicode": "1f1ec-1f1f1",
                "key": ":flag_gl:"
            },
            "flag_gm": {
                "unicode": "1f1ec-1f1f2",
                "key": ":flag_gm:"
            },
            "flag_gn": {
                "unicode": "1f1ec-1f1f3",
                "key": ":flag_gn:"
            },
            "flag_gp": {
                "unicode": "1f1ec-1f1f5",
                "key": ":flag_gp:"
            },
            "flag_gq": {
                "unicode": "1f1ec-1f1f6",
                "key": ":flag_gq:"
            },
            "flag_gr": {
                "unicode": "1f1ec-1f1f7",
                "key": ":flag_gr:"
            },
            "flag_gs": {
                "unicode": "1f1ec-1f1f8",
                "key": ":flag_gs:"
            },
            "flag_gt": {
                "unicode": "1f1ec-1f1f9",
                "key": ":flag_gt:"
            },
            "flag_gu": {
                "unicode": "1f1ec-1f1fa",
                "key": ":flag_gu:"
            },
            "flag_gw": {
                "unicode": "1f1ec-1f1fc",
                "key": ":flag_gw:"
            },
            "flag_gy": {
                "unicode": "1f1ec-1f1fe",
                "key": ":flag_gy:"
            },
            "flag_hk": {
                "unicode": "1f1ed-1f1f0",
                "key": ":flag_hk:"
            },
            "flag_hm": {
                "unicode": "1f1ed-1f1f2",
                "key": ":flag_hm:"
            },
            "flag_hn": {
                "unicode": "1f1ed-1f1f3",
                "key": ":flag_hn:"
            },
            "flag_hr": {
                "unicode": "1f1ed-1f1f7",
                "key": ":flag_hr:"
            },
            "flag_ht": {
                "unicode": "1f1ed-1f1f9",
                "key": ":flag_ht:"
            },
            "flag_hu": {
                "unicode": "1f1ed-1f1fa",
                "key": ":flag_hu:"
            },
            "flag_ic": {
                "unicode": "1f1ee-1f1e8",
                "key": ":flag_ic:"
            },
            "flag_id": {
                "unicode": "1f1ee-1f1e9",
                "key": ":flag_id:"
            },
            "flag_ie": {
                "unicode": "1f1ee-1f1ea",
                "key": ":flag_ie:"
            },
            "flag_il": {
                "unicode": "1f1ee-1f1f1",
                "key": ":flag_il:"
            },
            "flag_im": {
                "unicode": "1f1ee-1f1f2",
                "key": ":flag_im:"
            },
            "flag_in": {
                "unicode": "1f1ee-1f1f3",
                "key": ":flag_in:"
            },
            "flag_io": {
                "unicode": "1f1ee-1f1f4",
                "key": ":flag_io:"
            },
            "flag_iq": {
                "unicode": "1f1ee-1f1f6",
                "key": ":flag_iq:"
            },
            "flag_ir": {
                "unicode": "1f1ee-1f1f7",
                "key": ":flag_ir:"
            },
            "flag_is": {
                "unicode": "1f1ee-1f1f8",
                "key": ":flag_is:"
            },
            "flag_it": {
                "unicode": "1f1ee-1f1f9",
                "key": ":flag_it:"
            },
            "flag_je": {
                "unicode": "1f1ef-1f1ea",
                "key": ":flag_je:"
            },
            "flag_jm": {
                "unicode": "1f1ef-1f1f2",
                "key": ":flag_jm:"
            },
            "flag_jo": {
                "unicode": "1f1ef-1f1f4",
                "key": ":flag_jo:"
            },
            "flag_jp": {
                "unicode": "1f1ef-1f1f5",
                "key": ":flag_jp:"
            },
            "flag_ke": {
                "unicode": "1f1f0-1f1ea",
                "key": ":flag_ke:"
            },
            "flag_kg": {
                "unicode": "1f1f0-1f1ec",
                "key": ":flag_kg:"
            },
            "flag_kh": {
                "unicode": "1f1f0-1f1ed",
                "key": ":flag_kh:"
            },
            "flag_ki": {
                "unicode": "1f1f0-1f1ee",
                "key": ":flag_ki:"
            },
            "flag_km": {
                "unicode": "1f1f0-1f1f2",
                "key": ":flag_km:"
            },
            "flag_kn": {
                "unicode": "1f1f0-1f1f3",
                "key": ":flag_kn:"
            },
            "flag_kp": {
                "unicode": "1f1f0-1f1f5",
                "key": ":flag_kp:"
            },
            "flag_kr": {
                "unicode": "1f1f0-1f1f7",
                "key": ":flag_kr:"
            },
            "flag_kw": {
                "unicode": "1f1f0-1f1fc",
                "key": ":flag_kw:"
            },
            "flag_ky": {
                "unicode": "1f1f0-1f1fe",
                "key": ":flag_ky:"
            },
            "flag_kz": {
                "unicode": "1f1f0-1f1ff",
                "key": ":flag_kz:"
            },
            "flag_la": {
                "unicode": "1f1f1-1f1e6",
                "key": ":flag_la:"
            },
            "flag_lb": {
                "unicode": "1f1f1-1f1e7",
                "key": ":flag_lb:"
            },
            "flag_lc": {
                "unicode": "1f1f1-1f1e8",
                "key": ":flag_lc:"
            },
            "flag_li": {
                "unicode": "1f1f1-1f1ee",
                "key": ":flag_li:"
            },
            "flag_lk": {
                "unicode": "1f1f1-1f1f0",
                "key": ":flag_lk:"
            },
            "flag_lr": {
                "unicode": "1f1f1-1f1f7",
                "key": ":flag_lr:"
            },
            "flag_ls": {
                "unicode": "1f1f1-1f1f8",
                "key": ":flag_ls:"
            },
            "flag_lt": {
                "unicode": "1f1f1-1f1f9",
                "key": ":flag_lt:"
            },
            "flag_lu": {
                "unicode": "1f1f1-1f1fa",
                "key": ":flag_lu:"
            },
            "flag_lv": {
                "unicode": "1f1f1-1f1fb",
                "key": ":flag_lv:"
            },
            "flag_ly": {
                "unicode": "1f1f1-1f1fe",
                "key": ":flag_ly:"
            },
            "flag_ma": {
                "unicode": "1f1f2-1f1e6",
                "key": ":flag_ma:"
            },
            "flag_mc": {
                "unicode": "1f1f2-1f1e8",
                "key": ":flag_mc:"
            },
            "flag_md": {
                "unicode": "1f1f2-1f1e9",
                "key": ":flag_md:"
            },
            "flag_me": {
                "unicode": "1f1f2-1f1ea",
                "key": ":flag_me:"
            },
            "flag_mf": {
                "unicode": "1f1f2-1f1eb",
                "key": ":flag_mf:"
            },
            "flag_mg": {
                "unicode": "1f1f2-1f1ec",
                "key": ":flag_mg:"
            },
            "flag_mh": {
                "unicode": "1f1f2-1f1ed",
                "key": ":flag_mh:"
            },
            "flag_mk": {
                "unicode": "1f1f2-1f1f0",
                "key": ":flag_mk:"
            },
            "flag_ml": {
                "unicode": "1f1f2-1f1f1",
                "key": ":flag_ml:"
            },
            "flag_mm": {
                "unicode": "1f1f2-1f1f2",
                "key": ":flag_mm:"
            },
            "flag_mn": {
                "unicode": "1f1f2-1f1f3",
                "key": ":flag_mn:"
            },
            "flag_mo": {
                "unicode": "1f1f2-1f1f4",
                "key": ":flag_mo:"
            },
            "flag_mp": {
                "unicode": "1f1f2-1f1f5",
                "key": ":flag_mp:"
            },
            "flag_mq": {
                "unicode": "1f1f2-1f1f6",
                "key": ":flag_mq:"
            },
            "flag_mr": {
                "unicode": "1f1f2-1f1f7",
                "key": ":flag_mr:"
            },
            "flag_ms": {
                "unicode": "1f1f2-1f1f8",
                "key": ":flag_ms:"
            },
            "flag_mt": {
                "unicode": "1f1f2-1f1f9",
                "key": ":flag_mt:"
            },
            "flag_mu": {
                "unicode": "1f1f2-1f1fa",
                "key": ":flag_mu:"
            },
            "flag_mv": {
                "unicode": "1f1f2-1f1fb",
                "key": ":flag_mv:"
            },
            "flag_mw": {
                "unicode": "1f1f2-1f1fc",
                "key": ":flag_mw:"
            },
            "flag_mx": {
                "unicode": "1f1f2-1f1fd",
                "key": ":flag_mx:"
            },
            "flag_my": {
                "unicode": "1f1f2-1f1fe",
                "key": ":flag_my:"
            },
            "flag_mz": {
                "unicode": "1f1f2-1f1ff",
                "key": ":flag_mz:"
            },
            "flag_na": {
                "unicode": "1f1f3-1f1e6",
                "key": ":flag_na:"
            },
            "flag_nc": {
                "unicode": "1f1f3-1f1e8",
                "key": ":flag_nc:"
            },
            "flag_ne": {
                "unicode": "1f1f3-1f1ea",
                "key": ":flag_ne:"
            },
            "flag_nf": {
                "unicode": "1f1f3-1f1eb",
                "key": ":flag_nf:"
            },
            "flag_ng": {
                "unicode": "1f1f3-1f1ec",
                "key": ":flag_ng:"
            },
            "flag_ni": {
                "unicode": "1f1f3-1f1ee",
                "key": ":flag_ni:"
            },
            "flag_nl": {
                "unicode": "1f1f3-1f1f1",
                "key": ":flag_nl:"
            },
            "flag_no": {
                "unicode": "1f1f3-1f1f4",
                "key": ":flag_no:"
            },
            "flag_np": {
                "unicode": "1f1f3-1f1f5",
                "key": ":flag_np:"
            },
            "flag_nr": {
                "unicode": "1f1f3-1f1f7",
                "key": ":flag_nr:"
            },
            "flag_nu": {
                "unicode": "1f1f3-1f1fa",
                "key": ":flag_nu:"
            },
            "flag_nz": {
                "unicode": "1f1f3-1f1ff",
                "key": ":flag_nz:"
            },
            "flag_om": {
                "unicode": "1f1f4-1f1f2",
                "key": ":flag_om:"
            },
            "flag_pa": {
                "unicode": "1f1f5-1f1e6",
                "key": ":flag_pa:"
            },
            "flag_pe": {
                "unicode": "1f1f5-1f1ea",
                "key": ":flag_pe:"
            },
            "flag_pf": {
                "unicode": "1f1f5-1f1eb",
                "key": ":flag_pf:"
            },
            "flag_pg": {
                "unicode": "1f1f5-1f1ec",
                "key": ":flag_pg:"
            },
            "flag_ph": {
                "unicode": "1f1f5-1f1ed",
                "key": ":flag_ph:"
            },
            "flag_pk": {
                "unicode": "1f1f5-1f1f0",
                "key": ":flag_pk:"
            },
            "flag_pl": {
                "unicode": "1f1f5-1f1f1",
                "key": ":flag_pl:"
            },
            "flag_pm": {
                "unicode": "1f1f5-1f1f2",
                "key": ":flag_pm:"
            },
            "flag_pn": {
                "unicode": "1f1f5-1f1f3",
                "key": ":flag_pn:"
            },
            "flag_pr": {
                "unicode": "1f1f5-1f1f7",
                "key": ":flag_pr:"
            },
            "flag_ps": {
                "unicode": "1f1f5-1f1f8",
                "key": ":flag_ps:"
            },
            "flag_pt": {
                "unicode": "1f1f5-1f1f9",
                "key": ":flag_pt:"
            },
            "flag_pw": {
                "unicode": "1f1f5-1f1fc",
                "key": ":flag_pw:"
            },
            "flag_py": {
                "unicode": "1f1f5-1f1fe",
                "key": ":flag_py:"
            },
            "flag_qa": {
                "unicode": "1f1f6-1f1e6",
                "key": ":flag_qa:"
            },
            "flag_re": {
                "unicode": "1f1f7-1f1ea",
                "key": ":flag_re:"
            },
            "flag_ro": {
                "unicode": "1f1f7-1f1f4",
                "key": ":flag_ro:"
            },
            "flag_rs": {
                "unicode": "1f1f7-1f1f8",
                "key": ":flag_rs:"
            },
            "flag_ru": {
                "unicode": "1f1f7-1f1fa",
                "key": ":flag_ru:"
            },
            "flag_rw": {
                "unicode": "1f1f7-1f1fc",
                "key": ":flag_rw:"
            },
            "flag_sa": {
                "unicode": "1f1f8-1f1e6",
                "key": ":flag_sa:"
            },
            "flag_sb": {
                "unicode": "1f1f8-1f1e7",
                "key": ":flag_sb:"
            },
            "flag_sc": {
                "unicode": "1f1f8-1f1e8",
                "key": ":flag_sc:"
            },
            "flag_sd": {
                "unicode": "1f1f8-1f1e9",
                "key": ":flag_sd:"
            },
            "flag_se": {
                "unicode": "1f1f8-1f1ea",
                "key": ":flag_se:"
            },
            "flag_sg": {
                "unicode": "1f1f8-1f1ec",
                "key": ":flag_sg:"
            },
            "flag_sh": {
                "unicode": "1f1f8-1f1ed",
                "key": ":flag_sh:"
            },
            "flag_si": {
                "unicode": "1f1f8-1f1ee",
                "key": ":flag_si:"
            },
            "flag_sj": {
                "unicode": "1f1f8-1f1ef",
                "key": ":flag_sj:"
            },
            "flag_sk": {
                "unicode": "1f1f8-1f1f0",
                "key": ":flag_sk:"
            },
            "flag_sl": {
                "unicode": "1f1f8-1f1f1",
                "key": ":flag_sl:"
            },
            "flag_sm": {
                "unicode": "1f1f8-1f1f2",
                "key": ":flag_sm:"
            },
            "flag_sn": {
                "unicode": "1f1f8-1f1f3",
                "key": ":flag_sn:"
            },
            "flag_so": {
                "unicode": "1f1f8-1f1f4",
                "key": ":flag_so:"
            },
            "flag_sr": {
                "unicode": "1f1f8-1f1f7",
                "key": ":flag_sr:"
            },
            "flag_ss": {
                "unicode": "1f1f8-1f1f8",
                "key": ":flag_ss:"
            },
            "flag_st": {
                "unicode": "1f1f8-1f1f9",
                "key": ":flag_st:"
            },
            "flag_sv": {
                "unicode": "1f1f8-1f1fb",
                "key": ":flag_sv:"
            },
            "flag_sx": {
                "unicode": "1f1f8-1f1fd",
                "key": ":flag_sx:"
            },
            "flag_sy": {
                "unicode": "1f1f8-1f1fe",
                "key": ":flag_sy:"
            },
            "flag_sz": {
                "unicode": "1f1f8-1f1ff",
                "key": ":flag_sz:"
            },
            "flag_ta": {
                "unicode": "1f1f9-1f1e6",
                "key": ":flag_ta:"
            },
            "flag_tc": {
                "unicode": "1f1f9-1f1e8",
                "key": ":flag_tc:"
            },
            "flag_td": {
                "unicode": "1f1f9-1f1e9",
                "key": ":flag_td:"
            },
            "flag_tf": {
                "unicode": "1f1f9-1f1eb",
                "key": ":flag_tf:"
            },
            "flag_tg": {
                "unicode": "1f1f9-1f1ec",
                "key": ":flag_tg:"
            },
            "flag_th": {
                "unicode": "1f1f9-1f1ed",
                "key": ":flag_th:"
            },
            "flag_tj": {
                "unicode": "1f1f9-1f1ef",
                "key": ":flag_tj:"
            },
            "flag_tk": {
                "unicode": "1f1f9-1f1f0",
                "key": ":flag_tk:"
            },
            "flag_tl": {
                "unicode": "1f1f9-1f1f1",
                "key": ":flag_tl:"
            },
            "flag_tm": {
                "unicode": "1f1f9-1f1f2",
                "key": ":flag_tm:"
            },
            "flag_tn": {
                "unicode": "1f1f9-1f1f3",
                "key": ":flag_tn:"
            },
            "flag_to": {
                "unicode": "1f1f9-1f1f4",
                "key": ":flag_to:"
            },
            "flag_tr": {
                "unicode": "1f1f9-1f1f7",
                "key": ":flag_tr:"
            },
            "flag_tt": {
                "unicode": "1f1f9-1f1f9",
                "key": ":flag_tt:"
            },
            "flag_tv": {
                "unicode": "1f1f9-1f1fb",
                "key": ":flag_tv:"
            },
            "flag_tw": {
                "unicode": "1f1f9-1f1fc",
                "key": ":flag_tw:"
            },
            "flag_tz": {
                "unicode": "1f1f9-1f1ff",
                "key": ":flag_tz:"
            },
            "flag_ua": {
                "unicode": "1f1fa-1f1e6",
                "key": ":flag_ua:"
            },
            "flag_ug": {
                "unicode": "1f1fa-1f1ec",
                "key": ":flag_ug:"
            },
            "flag_um": {
                "unicode": "1f1fa-1f1f2",
                "key": ":flag_um:"
            },
            "flag_us": {
                "unicode": "1f1fa-1f1f8",
                "key": ":flag_us:"
            },
            "flag_uy": {
                "unicode": "1f1fa-1f1fe",
                "key": ":flag_uy:"
            },
            "flag_uz": {
                "unicode": "1f1fa-1f1ff",
                "key": ":flag_uz:"
            },
            "flag_va": {
                "unicode": "1f1fb-1f1e6",
                "key": ":flag_va:"
            },
            "flag_vc": {
                "unicode": "1f1fb-1f1e8",
                "key": ":flag_vc:"
            },
            "flag_ve": {
                "unicode": "1f1fb-1f1ea",
                "key": ":flag_ve:"
            },
            "flag_vg": {
                "unicode": "1f1fb-1f1ec",
                "key": ":flag_vg:"
            },
            "flag_vi": {
                "unicode": "1f1fb-1f1ee",
                "key": ":flag_vi:"
            },
            "flag_vn": {
                "unicode": "1f1fb-1f1f3",
                "key": ":flag_vn:"
            },
            "flag_vu": {
                "unicode": "1f1fb-1f1fa",
                "key": ":flag_vu:"
            },
            "flag_wf": {
                "unicode": "1f1fc-1f1eb",
                "key": ":flag_wf:"
            },
            "flag_white": {
                "unicode": "1f3f3",
                "key": ":flag_white:"
            },
            "flag_ws": {
                "unicode": "1f1fc-1f1f8",
                "key": ":flag_ws:"
            },
            "flag_xk": {
                "unicode": "1f1fd-1f1f0",
                "key": ":flag_xk:"
            },
            "flag_ye": {
                "unicode": "1f1fe-1f1ea",
                "key": ":flag_ye:"
            },
            "flag_yt": {
                "unicode": "1f1fe-1f1f9",
                "key": ":flag_yt:"
            },
            "flag_za": {
                "unicode": "1f1ff-1f1e6",
                "key": ":flag_za:"
            },
            "flag_zm": {
                "unicode": "1f1ff-1f1f2",
                "key": ":flag_zm:"
            },
            "flag_zw": {
                "unicode": "1f1ff-1f1fc",
                "key": ":flag_zw:"
            },
            "flags": {
                "unicode": "1f38f",
                "key": ":flags:"
            },
            "flashlight": {
                "unicode": "1f526",
                "key": ":flashlight:"
            },
            "fleur-de-lis": {
                "unicode": "269c",
                "key": ":fleur-de-lis:"
            },
            "floppy_disk": {
                "unicode": "1f4be",
                "key": ":floppy_disk:"
            },
            "flower_playing_cards": {
                "unicode": "1f3b4",
                "key": ":flower_playing_cards:"
            },
            "flushed": {
                "unicode": "1f633",
                "key": ":flushed:"
            },
            "fog": {
                "unicode": "1f32b",
                "key": ":fog:"
            },
            "foggy": {
                "unicode": "1f301",
                "key": ":foggy:"
            },
            "football": {
                "unicode": "1f3c8",
                "key": ":football:"
            },
            "footprints": {
                "unicode": "1f463",
                "key": ":footprints:"
            },
            "fork_and_knife": {
                "unicode": "1f374",
                "key": ":fork_and_knife:"
            },
            "fork_knife_plate": {
                "unicode": "1f37d",
                "key": ":fork_knife_plate:"
            },
            "fountain": {
                "unicode": "26f2",
                "key": ":fountain:"
            },
            "four": {
                "unicode": "0034-20e3",
                "key": ":four:"
            },
            "four_leaf_clover": {
                "unicode": "1f340",
                "key": ":four_leaf_clover:"
            },
            "fox": {
                "unicode": "1f98a",
                "key": ":fox:"
            },
            "frame_photo": {
                "unicode": "1f5bc",
                "key": ":frame_photo:"
            },
            "free": {
                "unicode": "1f193",
                "key": ":free:"
            },
            "french_bread": {
                "unicode": "1f956",
                "key": ":french_bread:"
            },
            "fried_shrimp": {
                "unicode": "1f364",
                "key": ":fried_shrimp:"
            },
            "fries": {
                "unicode": "1f35f",
                "key": ":fries:"
            },
            "frog": {
                "unicode": "1f438",
                "key": ":frog:"
            },
            "frowning": {
                "unicode": "1f626",
                "key": ":frowning:"
            },
            "frowning2": {
                "unicode": "2639",
                "key": ":frowning2:"
            },
            "fuelpump": {
                "unicode": "26fd",
                "key": ":fuelpump:"
            },
            "full_moon": {
                "unicode": "1f315",
                "key": ":full_moon:"
            },
            "full_moon_with_face": {
                "unicode": "1f31d",
                "key": ":full_moon_with_face:"
            },
            "game_die": {
                "unicode": "1f3b2",
                "key": ":game_die:"
            },
            "gear": {
                "unicode": "2699",
                "key": ":gear:"
            },
            "gem": {
                "unicode": "1f48e",
                "key": ":gem:"
            },
            "gemini": {
                "unicode": "264a",
                "key": ":gemini:"
            },
            "ghost": {
                "unicode": "1f47b",
                "key": ":ghost:"
            },
            "gift": {
                "unicode": "1f381",
                "key": ":gift:"
            },
            "gift_heart": {
                "unicode": "1f49d",
                "key": ":gift_heart:"
            },
            "girl": {
                "unicode": "1f467",
                "key": ":girl:"
            },
            "girl_tone1": {
                "unicode": "1f467-1f3fb",
                "key": ":girl_tone1:"
            },
            "girl_tone2": {
                "unicode": "1f467-1f3fc",
                "key": ":girl_tone2:"
            },
            "girl_tone3": {
                "unicode": "1f467-1f3fd",
                "key": ":girl_tone3:"
            },
            "girl_tone4": {
                "unicode": "1f467-1f3fe",
                "key": ":girl_tone4:"
            },
            "girl_tone5": {
                "unicode": "1f467-1f3ff",
                "key": ":girl_tone5:"
            },
            "globe_with_meridians": {
                "unicode": "1f310",
                "key": ":globe_with_meridians:"
            },
            "goal": {
                "unicode": "1f945",
                "key": ":goal:"
            },
            "goat": {
                "unicode": "1f410",
                "key": ":goat:"
            },
            "golf": {
                "unicode": "26f3",
                "key": ":golf:"
            },
            "golfer": {
                "unicode": "1f3cc",
                "key": ":golfer:"
            },
            "gorilla": {
                "unicode": "1f98d",
                "key": ":gorilla:"
            },
            "grapes": {
                "unicode": "1f347",
                "key": ":grapes:"
            },
            "green_apple": {
                "unicode": "1f34f",
                "key": ":green_apple:"
            },
            "green_book": {
                "unicode": "1f4d7",
                "key": ":green_book:"
            },
            "green_heart": {
                "unicode": "1f49a",
                "key": ":green_heart:"
            },
            "grey_exclamation": {
                "unicode": "2755",
                "key": ":grey_exclamation:"
            },
            "grey_question": {
                "unicode": "2754",
                "key": ":grey_question:"
            },
            "grimacing": {
                "unicode": "1f62c",
                "key": ":grimacing:"
            },
            "grin": {
                "unicode": "1f601",
                "key": ":grin:"
            },
            "grinning": {
                "unicode": "1f600",
                "key": ":grinning:"
            },
            "guardsman": {
                "unicode": "1f482",
                "key": ":guardsman:"
            },
            "guardsman_tone1": {
                "unicode": "1f482-1f3fb",
                "key": ":guardsman_tone1:"
            },
            "guardsman_tone2": {
                "unicode": "1f482-1f3fc",
                "key": ":guardsman_tone2:"
            },
            "guardsman_tone3": {
                "unicode": "1f482-1f3fd",
                "key": ":guardsman_tone3:"
            },
            "guardsman_tone4": {
                "unicode": "1f482-1f3fe",
                "key": ":guardsman_tone4:"
            },
            "guardsman_tone5": {
                "unicode": "1f482-1f3ff",
                "key": ":guardsman_tone5:"
            },
            "guitar": {
                "unicode": "1f3b8",
                "key": ":guitar:"
            },
            "gun": {
                "unicode": "1f52b",
                "key": ":gun:"
            },
            "haircut": {
                "unicode": "1f487",
                "key": ":haircut:"
            },
            "haircut_tone1": {
                "unicode": "1f487-1f3fb",
                "key": ":haircut_tone1:"
            },
            "haircut_tone2": {
                "unicode": "1f487-1f3fc",
                "key": ":haircut_tone2:"
            },
            "haircut_tone3": {
                "unicode": "1f487-1f3fd",
                "key": ":haircut_tone3:"
            },
            "haircut_tone4": {
                "unicode": "1f487-1f3fe",
                "key": ":haircut_tone4:"
            },
            "haircut_tone5": {
                "unicode": "1f487-1f3ff",
                "key": ":haircut_tone5:"
            },
            "hamburger": {
                "unicode": "1f354",
                "key": ":hamburger:"
            },
            "hammer": {
                "unicode": "1f528",
                "key": ":hammer:"
            },
            "hammer_pick": {
                "unicode": "2692",
                "key": ":hammer_pick:"
            },
            "hamster": {
                "unicode": "1f439",
                "key": ":hamster:"
            },
            "hand_splayed": {
                "unicode": "1f590",
                "key": ":hand_splayed:"
            },
            "hand_splayed_tone1": {
                "unicode": "1f590-1f3fb",
                "key": ":hand_splayed_tone1:"
            },
            "hand_splayed_tone2": {
                "unicode": "1f590-1f3fc",
                "key": ":hand_splayed_tone2:"
            },
            "hand_splayed_tone3": {
                "unicode": "1f590-1f3fd",
                "key": ":hand_splayed_tone3:"
            },
            "hand_splayed_tone4": {
                "unicode": "1f590-1f3fe",
                "key": ":hand_splayed_tone4:"
            },
            "hand_splayed_tone5": {
                "unicode": "1f590-1f3ff",
                "key": ":hand_splayed_tone5:"
            },
            "handbag": {
                "unicode": "1f45c",
                "key": ":handbag:"
            },
            "handball": {
                "unicode": "1f93e",
                "key": ":handball:"
            },
            "handball_tone1": {
                "unicode": "1f93e-1f3fb",
                "key": ":handball_tone1:"
            },
            "handball_tone2": {
                "unicode": "1f93e-1f3fc",
                "key": ":handball_tone2:"
            },
            "handball_tone3": {
                "unicode": "1f93e-1f3fd",
                "key": ":handball_tone3:"
            },
            "handball_tone4": {
                "unicode": "1f93e-1f3fe",
                "key": ":handball_tone4:"
            },
            "handball_tone5": {
                "unicode": "1f93e-1f3ff",
                "key": ":handball_tone5:"
            },
            "handshake": {
                "unicode": "1f91d",
                "key": ":handshake:"
            },
            "handshake_tone1": {
                "unicode": "1f91d-1f3fb",
                "key": ":handshake_tone1:"
            },
            "handshake_tone2": {
                "unicode": "1f91d-1f3fc",
                "key": ":handshake_tone2:"
            },
            "handshake_tone3": {
                "unicode": "1f91d-1f3fd",
                "key": ":handshake_tone3:"
            },
            "handshake_tone4": {
                "unicode": "1f91d-1f3fe",
                "key": ":handshake_tone4:"
            },
            "handshake_tone5": {
                "unicode": "1f91d-1f3ff",
                "key": ":handshake_tone5:"
            },
            "hash": {
                "unicode": "0023-20e3",
                "key": ":hash:"
            },
            "hatched_chick": {
                "unicode": "1f425",
                "key": ":hatched_chick:"
            },
            "hatching_chick": {
                "unicode": "1f423",
                "key": ":hatching_chick:"
            },
            "head_bandage": {
                "unicode": "1f915",
                "key": ":head_bandage:"
            },
            "headphones": {
                "unicode": "1f3a7",
                "key": ":headphones:"
            },
            "hear_no_evil": {
                "unicode": "1f649",
                "key": ":hear_no_evil:"
            },
            "heart": {
                "unicode": "2764",
                "key": ":heart:"
            },
            "heart_decoration": {
                "unicode": "1f49f",
                "key": ":heart_decoration:"
            },
            "heart_exclamation": {
                "unicode": "2763",
                "key": ":heart_exclamation:"
            },
            "heart_eyes": {
                "unicode": "1f60d",
                "key": ":heart_eyes:"
            },
            "heart_eyes_cat": {
                "unicode": "1f63b",
                "key": ":heart_eyes_cat:"
            },
            "heartbeat": {
                "unicode": "1f493",
                "key": ":heartbeat:"
            },
            "heartpulse": {
                "unicode": "1f497",
                "key": ":heartpulse:"
            },
            "hearts": {
                "unicode": "2665",
                "key": ":hearts:"
            },
            "heavy_check_mark": {
                "unicode": "2714",
                "key": ":heavy_check_mark:"
            },
            "heavy_division_sign": {
                "unicode": "2797",
                "key": ":heavy_division_sign:"
            },
            "heavy_dollar_sign": {
                "unicode": "1f4b2",
                "key": ":heavy_dollar_sign:"
            },
            "heavy_minus_sign": {
                "unicode": "2796",
                "key": ":heavy_minus_sign:"
            },
            "heavy_multiplication_x": {
                "unicode": "2716",
                "key": ":heavy_multiplication_x:"
            },
            "heavy_plus_sign": {
                "unicode": "2795",
                "key": ":heavy_plus_sign:"
            },
            "helicopter": {
                "unicode": "1f681",
                "key": ":helicopter:"
            },
            "helmet_with_cross": {
                "unicode": "26d1",
                "key": ":helmet_with_cross:"
            },
            "herb": {
                "unicode": "1f33f",
                "key": ":herb:"
            },
            "hibiscus": {
                "unicode": "1f33a",
                "key": ":hibiscus:"
            },
            "high_brightness": {
                "unicode": "1f506",
                "key": ":high_brightness:"
            },
            "high_heel": {
                "unicode": "1f460",
                "key": ":high_heel:"
            },
            "hockey": {
                "unicode": "1f3d2",
                "key": ":hockey:"
            },
            "hole": {
                "unicode": "1f573",
                "key": ":hole:"
            },
            "homes": {
                "unicode": "1f3d8",
                "key": ":homes:"
            },
            "honey_pot": {
                "unicode": "1f36f",
                "key": ":honey_pot:"
            },
            "horse": {
                "unicode": "1f434",
                "key": ":horse:"
            },
            "horse_racing": {
                "unicode": "1f3c7",
                "key": ":horse_racing:"
            },
            "horse_racing_tone1": {
                "unicode": "1f3c7-1f3fb",
                "key": ":horse_racing_tone1:"
            },
            "horse_racing_tone2": {
                "unicode": "1f3c7-1f3fc",
                "key": ":horse_racing_tone2:"
            },
            "horse_racing_tone3": {
                "unicode": "1f3c7-1f3fd",
                "key": ":horse_racing_tone3:"
            },
            "horse_racing_tone4": {
                "unicode": "1f3c7-1f3fe",
                "key": ":horse_racing_tone4:"
            },
            "horse_racing_tone5": {
                "unicode": "1f3c7-1f3ff",
                "key": ":horse_racing_tone5:"
            },
            "hospital": {
                "unicode": "1f3e5",
                "key": ":hospital:"
            },
            "hot_pepper": {
                "unicode": "1f336",
                "key": ":hot_pepper:"
            },
            "hotdog": {
                "unicode": "1f32d",
                "key": ":hotdog:"
            },
            "hotel": {
                "unicode": "1f3e8",
                "key": ":hotel:"
            },
            "hotsprings": {
                "unicode": "2668",
                "key": ":hotsprings:"
            },
            "hourglass": {
                "unicode": "231b",
                "key": ":hourglass:"
            },
            "hourglass_flowing_sand": {
                "unicode": "23f3",
                "key": ":hourglass_flowing_sand:"
            },
            "house": {
                "unicode": "1f3e0",
                "key": ":house:"
            },
            "house_abandoned": {
                "unicode": "1f3da",
                "key": ":house_abandoned:"
            },
            "house_with_garden": {
                "unicode": "1f3e1",
                "key": ":house_with_garden:"
            },
            "hugging": {
                "unicode": "1f917",
                "key": ":hugging:"
            },
            "hushed": {
                "unicode": "1f62f",
                "key": ":hushed:"
            },
            "ice_cream": {
                "unicode": "1f368",
                "key": ":ice_cream:"
            },
            "ice_skate": {
                "unicode": "26f8",
                "key": ":ice_skate:"
            },
            "icecream": {
                "unicode": "1f366",
                "key": ":icecream:"
            },
            "id": {
                "unicode": "1f194",
                "key": ":id:"
            },
            "ideograph_advantage": {
                "unicode": "1f250",
                "key": ":ideograph_advantage:"
            },
            "imp": {
                "unicode": "1f47f",
                "key": ":imp:"
            },
            "inbox_tray": {
                "unicode": "1f4e5",
                "key": ":inbox_tray:"
            },
            "incoming_envelope": {
                "unicode": "1f4e8",
                "key": ":incoming_envelope:"
            },
            "information_desk_person": {
                "unicode": "1f481",
                "key": ":information_desk_person:"
            },
            "information_desk_person_tone1": {
                "unicode": "1f481-1f3fb",
                "key": ":information_desk_person_tone1:"
            },
            "information_desk_person_tone2": {
                "unicode": "1f481-1f3fc",
                "key": ":information_desk_person_tone2:"
            },
            "information_desk_person_tone3": {
                "unicode": "1f481-1f3fd",
                "key": ":information_desk_person_tone3:"
            },
            "information_desk_person_tone4": {
                "unicode": "1f481-1f3fe",
                "key": ":information_desk_person_tone4:"
            },
            "information_desk_person_tone5": {
                "unicode": "1f481-1f3ff",
                "key": ":information_desk_person_tone5:"
            },
            "information_source": {
                "unicode": "2139",
                "key": ":information_source:"
            },
            "innocent": {
                "unicode": "1f607",
                "key": ":innocent:"
            },
            "interrobang": {
                "unicode": "2049",
                "key": ":interrobang:"
            },
            "iphone": {
                "unicode": "1f4f1",
                "key": ":iphone:"
            },
            "island": {
                "unicode": "1f3dd",
                "key": ":island:"
            },
            "izakaya_lantern": {
                "unicode": "1f3ee",
                "key": ":izakaya_lantern:"
            },
            "jack_o_lantern": {
                "unicode": "1f383",
                "key": ":jack_o_lantern:"
            },
            "japan": {
                "unicode": "1f5fe",
                "key": ":japan:"
            },
            "japanese_castle": {
                "unicode": "1f3ef",
                "key": ":japanese_castle:"
            },
            "japanese_goblin": {
                "unicode": "1f47a",
                "key": ":japanese_goblin:"
            },
            "japanese_ogre": {
                "unicode": "1f479",
                "key": ":japanese_ogre:"
            },
            "jeans": {
                "unicode": "1f456",
                "key": ":jeans:"
            },
            "joy": {
                "unicode": "1f602",
                "key": ":joy:"
            },
            "joy_cat": {
                "unicode": "1f639",
                "key": ":joy_cat:"
            },
            "joystick": {
                "unicode": "1f579",
                "key": ":joystick:"
            },
            "juggling": {
                "unicode": "1f939",
                "key": ":juggling:"
            },
            "juggling_tone1": {
                "unicode": "1f939-1f3fb",
                "key": ":juggling_tone1:"
            },
            "juggling_tone2": {
                "unicode": "1f939-1f3fc",
                "key": ":juggling_tone2:"
            },
            "juggling_tone3": {
                "unicode": "1f939-1f3fd",
                "key": ":juggling_tone3:"
            },
            "juggling_tone4": {
                "unicode": "1f939-1f3fe",
                "key": ":juggling_tone4:"
            },
            "juggling_tone5": {
                "unicode": "1f939-1f3ff",
                "key": ":juggling_tone5:"
            },
            "kaaba": {
                "unicode": "1f54b",
                "key": ":kaaba:"
            },
            "key": {
                "unicode": "1f511",
                "key": ":key:"
            },
            "key2": {
                "unicode": "1f5dd",
                "key": ":key2:"
            },
            "keyboard": {
                "unicode": "2328",
                "key": ":keyboard:"
            },
            "keycap_ten": {
                "unicode": "1f51f",
                "key": ":keycap_ten:"
            },
            "kimono": {
                "unicode": "1f458",
                "key": ":kimono:"
            },
            "kiss": {
                "unicode": "1f48b",
                "key": ":kiss:"
            },
            "kiss_mm": {
                "unicode": "1f468-2764-1f48b-1f468",
                "key": ":kiss_mm:"
            },
            "kiss_ww": {
                "unicode": "1f469-2764-1f48b-1f469",
                "key": ":kiss_ww:"
            },
            "kissing": {
                "unicode": "1f617",
                "key": ":kissing:"
            },
            "kissing_cat": {
                "unicode": "1f63d",
                "key": ":kissing_cat:"
            },
            "kissing_closed_eyes": {
                "unicode": "1f61a",
                "key": ":kissing_closed_eyes:"
            },
            "kissing_heart": {
                "unicode": "1f618",
                "key": ":kissing_heart:"
            },
            "kissing_smiling_eyes": {
                "unicode": "1f619",
                "key": ":kissing_smiling_eyes:"
            },
            "kiwi": {
                "unicode": "1f95d",
                "key": ":kiwi:"
            },
            "knife": {
                "unicode": "1f52a",
                "key": ":knife:"
            },
            "koala": {
                "unicode": "1f428",
                "key": ":koala:"
            },
            "koko": {
                "unicode": "1f201",
                "key": ":koko:"
            },
            "label": {
                "unicode": "1f3f7",
                "key": ":label:"
            },
            "large_blue_diamond": {
                "unicode": "1f537",
                "key": ":large_blue_diamond:"
            },
            "large_orange_diamond": {
                "unicode": "1f536",
                "key": ":large_orange_diamond:"
            },
            "last_quarter_moon": {
                "unicode": "1f317",
                "key": ":last_quarter_moon:"
            },
            "last_quarter_moon_with_face": {
                "unicode": "1f31c",
                "key": ":last_quarter_moon_with_face:"
            },
            "laughing": {
                "unicode": "1f606",
                "key": ":laughing:"
            },
            "leaves": {
                "unicode": "1f343",
                "key": ":leaves:"
            },
            "ledger": {
                "unicode": "1f4d2",
                "key": ":ledger:"
            },
            "left_facing_fist": {
                "unicode": "1f91b",
                "key": ":left_facing_fist:"
            },
            "left_facing_fist_tone1": {
                "unicode": "1f91b-1f3fb",
                "key": ":left_facing_fist_tone1:"
            },
            "left_facing_fist_tone2": {
                "unicode": "1f91b-1f3fc",
                "key": ":left_facing_fist_tone2:"
            },
            "left_facing_fist_tone3": {
                "unicode": "1f91b-1f3fd",
                "key": ":left_facing_fist_tone3:"
            },
            "left_facing_fist_tone4": {
                "unicode": "1f91b-1f3fe",
                "key": ":left_facing_fist_tone4:"
            },
            "left_facing_fist_tone5": {
                "unicode": "1f91b-1f3ff",
                "key": ":left_facing_fist_tone5:"
            },
            "left_luggage": {
                "unicode": "1f6c5",
                "key": ":left_luggage:"
            },
            "left_right_arrow": {
                "unicode": "2194",
                "key": ":left_right_arrow:"
            },
            "leftwards_arrow_with_hook": {
                "unicode": "21a9",
                "key": ":leftwards_arrow_with_hook:"
            },
            "lemon": {
                "unicode": "1f34b",
                "key": ":lemon:"
            },
            "leo": {
                "unicode": "264c",
                "key": ":leo:"
            },
            "leopard": {
                "unicode": "1f406",
                "key": ":leopard:"
            },
            "level_slider": {
                "unicode": "1f39a",
                "key": ":level_slider:"
            },
            "levitate": {
                "unicode": "1f574",
                "key": ":levitate:"
            },
            "libra": {
                "unicode": "264e",
                "key": ":libra:"
            },
            "lifter": {
                "unicode": "1f3cb",
                "key": ":lifter:"
            },
            "lifter_tone1": {
                "unicode": "1f3cb-1f3fb",
                "key": ":lifter_tone1:"
            },
            "lifter_tone2": {
                "unicode": "1f3cb-1f3fc",
                "key": ":lifter_tone2:"
            },
            "lifter_tone3": {
                "unicode": "1f3cb-1f3fd",
                "key": ":lifter_tone3:"
            },
            "lifter_tone4": {
                "unicode": "1f3cb-1f3fe",
                "key": ":lifter_tone4:"
            },
            "lifter_tone5": {
                "unicode": "1f3cb-1f3ff",
                "key": ":lifter_tone5:"
            },
            "light_rail": {
                "unicode": "1f688",
                "key": ":light_rail:"
            },
            "link": {
                "unicode": "1f517",
                "key": ":link:"
            },
            "lion_face": {
                "unicode": "1f981",
                "key": ":lion_face:"
            },
            "lips": {
                "unicode": "1f444",
                "key": ":lips:"
            },
            "lipstick": {
                "unicode": "1f484",
                "key": ":lipstick:"
            },
            "lizard": {
                "unicode": "1f98e",
                "key": ":lizard:"
            },
            "lock": {
                "unicode": "1f512",
                "key": ":lock:"
            },
            "lock_with_ink_pen": {
                "unicode": "1f50f",
                "key": ":lock_with_ink_pen:"
            },
            "lollipop": {
                "unicode": "1f36d",
                "key": ":lollipop:"
            },
            "loop": {
                "unicode": "27bf",
                "key": ":loop:"
            },
            "loud_sound": {
                "unicode": "1f50a",
                "key": ":loud_sound:"
            },
            "loudspeaker": {
                "unicode": "1f4e2",
                "key": ":loudspeaker:"
            },
            "love_hotel": {
                "unicode": "1f3e9",
                "key": ":love_hotel:"
            },
            "love_letter": {
                "unicode": "1f48c",
                "key": ":love_letter:"
            },
            "low_brightness": {
                "unicode": "1f505",
                "key": ":low_brightness:"
            },
            "lying_face": {
                "unicode": "1f925",
                "key": ":lying_face:"
            },
            "m": {
                "unicode": "24c2",
                "key": ":m:"
            },
            "mag": {
                "unicode": "1f50d",
                "key": ":mag:"
            },
            "mag_right": {
                "unicode": "1f50e",
                "key": ":mag_right:"
            },
            "mahjong": {
                "unicode": "1f004",
                "key": ":mahjong:"
            },
            "mailbox": {
                "unicode": "1f4eb",
                "key": ":mailbox:"
            },
            "mailbox_closed": {
                "unicode": "1f4ea",
                "key": ":mailbox_closed:"
            },
            "mailbox_with_mail": {
                "unicode": "1f4ec",
                "key": ":mailbox_with_mail:"
            },
            "mailbox_with_no_mail": {
                "unicode": "1f4ed",
                "key": ":mailbox_with_no_mail:"
            },
            "man": {
                "unicode": "1f468",
                "key": ":man:"
            },
            "man_dancing": {
                "unicode": "1f57a",
                "key": ":man_dancing:"
            },
            "man_dancing_tone1": {
                "unicode": "1f57a-1f3fb",
                "key": ":man_dancing_tone1:"
            },
            "man_dancing_tone2": {
                "unicode": "1f57a-1f3fc",
                "key": ":man_dancing_tone2:"
            },
            "man_dancing_tone3": {
                "unicode": "1f57a-1f3fd",
                "key": ":man_dancing_tone3:"
            },
            "man_dancing_tone4": {
                "unicode": "1f57a-1f3fe",
                "key": ":man_dancing_tone4:"
            },
            "man_dancing_tone5": {
                "unicode": "1f57a-1f3ff",
                "key": ":man_dancing_tone5:"
            },
            "man_in_tuxedo": {
                "unicode": "1f935",
                "key": ":man_in_tuxedo:"
            },
            "man_in_tuxedo_tone1": {
                "unicode": "1f935-1f3fb",
                "key": ":man_in_tuxedo_tone1:"
            },
            "man_in_tuxedo_tone2": {
                "unicode": "1f935-1f3fc",
                "key": ":man_in_tuxedo_tone2:"
            },
            "man_in_tuxedo_tone3": {
                "unicode": "1f935-1f3fd",
                "key": ":man_in_tuxedo_tone3:"
            },
            "man_in_tuxedo_tone4": {
                "unicode": "1f935-1f3fe",
                "key": ":man_in_tuxedo_tone4:"
            },
            "man_in_tuxedo_tone5": {
                "unicode": "1f935-1f3ff",
                "key": ":man_in_tuxedo_tone5:"
            },
            "man_tone1": {
                "unicode": "1f468-1f3fb",
                "key": ":man_tone1:"
            },
            "man_tone2": {
                "unicode": "1f468-1f3fc",
                "key": ":man_tone2:"
            },
            "man_tone3": {
                "unicode": "1f468-1f3fd",
                "key": ":man_tone3:"
            },
            "man_tone4": {
                "unicode": "1f468-1f3fe",
                "key": ":man_tone4:"
            },
            "man_tone5": {
                "unicode": "1f468-1f3ff",
                "key": ":man_tone5:"
            },
            "man_with_gua_pi_mao": {
                "unicode": "1f472",
                "key": ":man_with_gua_pi_mao:"
            },
            "man_with_gua_pi_mao_tone1": {
                "unicode": "1f472-1f3fb",
                "key": ":man_with_gua_pi_mao_tone1:"
            },
            "man_with_gua_pi_mao_tone2": {
                "unicode": "1f472-1f3fc",
                "key": ":man_with_gua_pi_mao_tone2:"
            },
            "man_with_gua_pi_mao_tone3": {
                "unicode": "1f472-1f3fd",
                "key": ":man_with_gua_pi_mao_tone3:"
            },
            "man_with_gua_pi_mao_tone4": {
                "unicode": "1f472-1f3fe",
                "key": ":man_with_gua_pi_mao_tone4:"
            },
            "man_with_gua_pi_mao_tone5": {
                "unicode": "1f472-1f3ff",
                "key": ":man_with_gua_pi_mao_tone5:"
            },
            "man_with_turban": {
                "unicode": "1f473",
                "key": ":man_with_turban:"
            },
            "man_with_turban_tone1": {
                "unicode": "1f473-1f3fb",
                "key": ":man_with_turban_tone1:"
            },
            "man_with_turban_tone2": {
                "unicode": "1f473-1f3fc",
                "key": ":man_with_turban_tone2:"
            },
            "man_with_turban_tone3": {
                "unicode": "1f473-1f3fd",
                "key": ":man_with_turban_tone3:"
            },
            "man_with_turban_tone4": {
                "unicode": "1f473-1f3fe",
                "key": ":man_with_turban_tone4:"
            },
            "man_with_turban_tone5": {
                "unicode": "1f473-1f3ff",
                "key": ":man_with_turban_tone5:"
            },
            "mans_shoe": {
                "unicode": "1f45e",
                "key": ":mans_shoe:"
            },
            "map": {
                "unicode": "1f5fa",
                "key": ":map:"
            },
            "maple_leaf": {
                "unicode": "1f341",
                "key": ":maple_leaf:"
            },
            "martial_arts_uniform": {
                "unicode": "1f94b",
                "key": ":martial_arts_uniform:"
            },
            "mask": {
                "unicode": "1f637",
                "key": ":mask:"
            },
            "massage": {
                "unicode": "1f486",
                "key": ":massage:"
            },
            "massage_tone1": {
                "unicode": "1f486-1f3fb",
                "key": ":massage_tone1:"
            },
            "massage_tone2": {
                "unicode": "1f486-1f3fc",
                "key": ":massage_tone2:"
            },
            "massage_tone3": {
                "unicode": "1f486-1f3fd",
                "key": ":massage_tone3:"
            },
            "massage_tone4": {
                "unicode": "1f486-1f3fe",
                "key": ":massage_tone4:"
            },
            "massage_tone5": {
                "unicode": "1f486-1f3ff",
                "key": ":massage_tone5:"
            },
            "meat_on_bone": {
                "unicode": "1f356",
                "key": ":meat_on_bone:"
            },
            "medal": {
                "unicode": "1f3c5",
                "key": ":medal:"
            },
            "mega": {
                "unicode": "1f4e3",
                "key": ":mega:"
            },
            "melon": {
                "unicode": "1f348",
                "key": ":melon:"
            },
            "menorah": {
                "unicode": "1f54e",
                "key": ":menorah:"
            },
            "mens": {
                "unicode": "1f6b9",
                "key": ":mens:"
            },
            "metal": {
                "unicode": "1f918",
                "key": ":metal:"
            },
            "metal_tone1": {
                "unicode": "1f918-1f3fb",
                "key": ":metal_tone1:"
            },
            "metal_tone2": {
                "unicode": "1f918-1f3fc",
                "key": ":metal_tone2:"
            },
            "metal_tone3": {
                "unicode": "1f918-1f3fd",
                "key": ":metal_tone3:"
            },
            "metal_tone4": {
                "unicode": "1f918-1f3fe",
                "key": ":metal_tone4:"
            },
            "metal_tone5": {
                "unicode": "1f918-1f3ff",
                "key": ":metal_tone5:"
            },
            "metro": {
                "unicode": "1f687",
                "key": ":metro:"
            },
            "microphone": {
                "unicode": "1f3a4",
                "key": ":microphone:"
            },
            "microphone2": {
                "unicode": "1f399",
                "key": ":microphone2:"
            },
            "microscope": {
                "unicode": "1f52c",
                "key": ":microscope:"
            },
            "middle_finger": {
                "unicode": "1f595",
                "key": ":middle_finger:"
            },
            "middle_finger_tone1": {
                "unicode": "1f595-1f3fb",
                "key": ":middle_finger_tone1:"
            },
            "middle_finger_tone2": {
                "unicode": "1f595-1f3fc",
                "key": ":middle_finger_tone2:"
            },
            "middle_finger_tone3": {
                "unicode": "1f595-1f3fd",
                "key": ":middle_finger_tone3:"
            },
            "middle_finger_tone4": {
                "unicode": "1f595-1f3fe",
                "key": ":middle_finger_tone4:"
            },
            "middle_finger_tone5": {
                "unicode": "1f595-1f3ff",
                "key": ":middle_finger_tone5:"
            },
            "military_medal": {
                "unicode": "1f396",
                "key": ":military_medal:"
            },
            "milk": {
                "unicode": "1f95b",
                "key": ":milk:"
            },
            "milky_way": {
                "unicode": "1f30c",
                "key": ":milky_way:"
            },
            "minibus": {
                "unicode": "1f690",
                "key": ":minibus:"
            },
            "minidisc": {
                "unicode": "1f4bd",
                "key": ":minidisc:"
            },
            "mobile_phone_off": {
                "unicode": "1f4f4",
                "key": ":mobile_phone_off:"
            },
            "money_mouth": {
                "unicode": "1f911",
                "key": ":money_mouth:"
            },
            "money_with_wings": {
                "unicode": "1f4b8",
                "key": ":money_with_wings:"
            },
            "moneybag": {
                "unicode": "1f4b0",
                "key": ":moneybag:"
            },
            "monkey": {
                "unicode": "1f412",
                "key": ":monkey:"
            },
            "monkey_face": {
                "unicode": "1f435",
                "key": ":monkey_face:"
            },
            "monorail": {
                "unicode": "1f69d",
                "key": ":monorail:"
            },
            "mortar_board": {
                "unicode": "1f393",
                "key": ":mortar_board:"
            },
            "mosque": {
                "unicode": "1f54c",
                "key": ":mosque:"
            },
            "motor_scooter": {
                "unicode": "1f6f5",
                "key": ":motor_scooter:"
            },
            "motorboat": {
                "unicode": "1f6e5",
                "key": ":motorboat:"
            },
            "motorcycle": {
                "unicode": "1f3cd",
                "key": ":motorcycle:"
            },
            "motorway": {
                "unicode": "1f6e3",
                "key": ":motorway:"
            },
            "mount_fuji": {
                "unicode": "1f5fb",
                "key": ":mount_fuji:"
            },
            "mountain": {
                "unicode": "26f0",
                "key": ":mountain:"
            },
            "mountain_bicyclist": {
                "unicode": "1f6b5",
                "key": ":mountain_bicyclist:"
            },
            "mountain_bicyclist_tone1": {
                "unicode": "1f6b5-1f3fb",
                "key": ":mountain_bicyclist_tone1:"
            },
            "mountain_bicyclist_tone2": {
                "unicode": "1f6b5-1f3fc",
                "key": ":mountain_bicyclist_tone2:"
            },
            "mountain_bicyclist_tone3": {
                "unicode": "1f6b5-1f3fd",
                "key": ":mountain_bicyclist_tone3:"
            },
            "mountain_bicyclist_tone4": {
                "unicode": "1f6b5-1f3fe",
                "key": ":mountain_bicyclist_tone4:"
            },
            "mountain_bicyclist_tone5": {
                "unicode": "1f6b5-1f3ff",
                "key": ":mountain_bicyclist_tone5:"
            },
            "mountain_cableway": {
                "unicode": "1f6a0",
                "key": ":mountain_cableway:"
            },
            "mountain_railway": {
                "unicode": "1f69e",
                "key": ":mountain_railway:"
            },
            "mountain_snow": {
                "unicode": "1f3d4",
                "key": ":mountain_snow:"
            },
            "mouse": {
                "unicode": "1f42d",
                "key": ":mouse:"
            },
            "mouse2": {
                "unicode": "1f401",
                "key": ":mouse2:"
            },
            "mouse_three_button": {
                "unicode": "1f5b1",
                "key": ":mouse_three_button:"
            },
            "movie_camera": {
                "unicode": "1f3a5",
                "key": ":movie_camera:"
            },
            "moyai": {
                "unicode": "1f5ff",
                "key": ":moyai:"
            },
            "mrs_claus": {
                "unicode": "1f936",
                "key": ":mrs_claus:"
            },
            "mrs_claus_tone1": {
                "unicode": "1f936-1f3fb",
                "key": ":mrs_claus_tone1:"
            },
            "mrs_claus_tone2": {
                "unicode": "1f936-1f3fc",
                "key": ":mrs_claus_tone2:"
            },
            "mrs_claus_tone3": {
                "unicode": "1f936-1f3fd",
                "key": ":mrs_claus_tone3:"
            },
            "mrs_claus_tone4": {
                "unicode": "1f936-1f3fe",
                "key": ":mrs_claus_tone4:"
            },
            "mrs_claus_tone5": {
                "unicode": "1f936-1f3ff",
                "key": ":mrs_claus_tone5:"
            },
            "muscle": {
                "unicode": "1f4aa",
                "key": ":muscle:"
            },
            "muscle_tone1": {
                "unicode": "1f4aa-1f3fb",
                "key": ":muscle_tone1:"
            },
            "muscle_tone2": {
                "unicode": "1f4aa-1f3fc",
                "key": ":muscle_tone2:"
            },
            "muscle_tone3": {
                "unicode": "1f4aa-1f3fd",
                "key": ":muscle_tone3:"
            },
            "muscle_tone4": {
                "unicode": "1f4aa-1f3fe",
                "key": ":muscle_tone4:"
            },
            "muscle_tone5": {
                "unicode": "1f4aa-1f3ff",
                "key": ":muscle_tone5:"
            },
            "mushroom": {
                "unicode": "1f344",
                "key": ":mushroom:"
            },
            "musical_keyboard": {
                "unicode": "1f3b9",
                "key": ":musical_keyboard:"
            },
            "musical_note": {
                "unicode": "1f3b5",
                "key": ":musical_note:"
            },
            "musical_score": {
                "unicode": "1f3bc",
                "key": ":musical_score:"
            },
            "mute": {
                "unicode": "1f507",
                "key": ":mute:"
            },
            "nail_care": {
                "unicode": "1f485",
                "key": ":nail_care:"
            },
            "nail_care_tone1": {
                "unicode": "1f485-1f3fb",
                "key": ":nail_care_tone1:"
            },
            "nail_care_tone2": {
                "unicode": "1f485-1f3fc",
                "key": ":nail_care_tone2:"
            },
            "nail_care_tone3": {
                "unicode": "1f485-1f3fd",
                "key": ":nail_care_tone3:"
            },
            "nail_care_tone4": {
                "unicode": "1f485-1f3fe",
                "key": ":nail_care_tone4:"
            },
            "nail_care_tone5": {
                "unicode": "1f485-1f3ff",
                "key": ":nail_care_tone5:"
            },
            "name_badge": {
                "unicode": "1f4db",
                "key": ":name_badge:"
            },
            "nauseated_face": {
                "unicode": "1f922",
                "key": ":nauseated_face:"
            },
            "necktie": {
                "unicode": "1f454",
                "key": ":necktie:"
            },
            "negative_squared_cross_mark": {
                "unicode": "274e",
                "key": ":negative_squared_cross_mark:"
            },
            "nerd": {
                "unicode": "1f913",
                "key": ":nerd:"
            },
            "neutral_face": {
                "unicode": "1f610",
                "key": ":neutral_face:"
            },
            "new": {
                "unicode": "1f195",
                "key": ":new:"
            },
            "new_moon": {
                "unicode": "1f311",
                "key": ":new_moon:"
            },
            "new_moon_with_face": {
                "unicode": "1f31a",
                "key": ":new_moon_with_face:"
            },
            "newspaper": {
                "unicode": "1f4f0",
                "key": ":newspaper:"
            },
            "newspaper2": {
                "unicode": "1f5de",
                "key": ":newspaper2:"
            },
            "ng": {
                "unicode": "1f196",
                "key": ":ng:"
            },
            "night_with_stars": {
                "unicode": "1f303",
                "key": ":night_with_stars:"
            },
            "nine": {
                "unicode": "0039-20e3",
                "key": ":nine:"
            },
            "no_bell": {
                "unicode": "1f515",
                "key": ":no_bell:"
            },
            "no_bicycles": {
                "unicode": "1f6b3",
                "key": ":no_bicycles:"
            },
            "no_entry": {
                "unicode": "26d4",
                "key": ":no_entry:"
            },
            "no_entry_sign": {
                "unicode": "1f6ab",
                "key": ":no_entry_sign:"
            },
            "no_good": {
                "unicode": "1f645",
                "key": ":no_good:"
            },
            "no_good_tone1": {
                "unicode": "1f645-1f3fb",
                "key": ":no_good_tone1:"
            },
            "no_good_tone2": {
                "unicode": "1f645-1f3fc",
                "key": ":no_good_tone2:"
            },
            "no_good_tone3": {
                "unicode": "1f645-1f3fd",
                "key": ":no_good_tone3:"
            },
            "no_good_tone4": {
                "unicode": "1f645-1f3fe",
                "key": ":no_good_tone4:"
            },
            "no_good_tone5": {
                "unicode": "1f645-1f3ff",
                "key": ":no_good_tone5:"
            },
            "no_mobile_phones": {
                "unicode": "1f4f5",
                "key": ":no_mobile_phones:"
            },
            "no_mouth": {
                "unicode": "1f636",
                "key": ":no_mouth:"
            },
            "no_pedestrians": {
                "unicode": "1f6b7",
                "key": ":no_pedestrians:"
            },
            "no_smoking": {
                "unicode": "1f6ad",
                "key": ":no_smoking:"
            },
            "non-potable_water": {
                "unicode": "1f6b1",
                "key": ":non-potable_water:"
            },
            "nose": {
                "unicode": "1f443",
                "key": ":nose:"
            },
            "nose_tone1": {
                "unicode": "1f443-1f3fb",
                "key": ":nose_tone1:"
            },
            "nose_tone2": {
                "unicode": "1f443-1f3fc",
                "key": ":nose_tone2:"
            },
            "nose_tone3": {
                "unicode": "1f443-1f3fd",
                "key": ":nose_tone3:"
            },
            "nose_tone4": {
                "unicode": "1f443-1f3fe",
                "key": ":nose_tone4:"
            },
            "nose_tone5": {
                "unicode": "1f443-1f3ff",
                "key": ":nose_tone5:"
            },
            "notebook": {
                "unicode": "1f4d3",
                "key": ":notebook:"
            },
            "notebook_with_decorative_cover": {
                "unicode": "1f4d4",
                "key": ":notebook_with_decorative_cover:"
            },
            "notepad_spiral": {
                "unicode": "1f5d2",
                "key": ":notepad_spiral:"
            },
            "notes": {
                "unicode": "1f3b6",
                "key": ":notes:"
            },
            "nut_and_bolt": {
                "unicode": "1f529",
                "key": ":nut_and_bolt:"
            },
            "o": {
                "unicode": "2b55",
                "key": ":o:"
            },
            "o2": {
                "unicode": "1f17e",
                "key": ":o2:"
            },
            "ocean": {
                "unicode": "1f30a",
                "key": ":ocean:"
            },
            "octagonal_sign": {
                "unicode": "1f6d1",
                "key": ":octagonal_sign:"
            },
            "octopus": {
                "unicode": "1f419",
                "key": ":octopus:"
            },
            "oden": {
                "unicode": "1f362",
                "key": ":oden:"
            },
            "office": {
                "unicode": "1f3e2",
                "key": ":office:"
            },
            "oil": {
                "unicode": "1f6e2",
                "key": ":oil:"
            },
            "ok": {
                "unicode": "1f197",
                "key": ":ok:"
            },
            "ok_hand": {
                "unicode": "1f44c",
                "key": ":ok_hand:"
            },
            "ok_hand_tone1": {
                "unicode": "1f44c-1f3fb",
                "key": ":ok_hand_tone1:"
            },
            "ok_hand_tone2": {
                "unicode": "1f44c-1f3fc",
                "key": ":ok_hand_tone2:"
            },
            "ok_hand_tone3": {
                "unicode": "1f44c-1f3fd",
                "key": ":ok_hand_tone3:"
            },
            "ok_hand_tone4": {
                "unicode": "1f44c-1f3fe",
                "key": ":ok_hand_tone4:"
            },
            "ok_hand_tone5": {
                "unicode": "1f44c-1f3ff",
                "key": ":ok_hand_tone5:"
            },
            "ok_woman": {
                "unicode": "1f646",
                "key": ":ok_woman:"
            },
            "ok_woman_tone1": {
                "unicode": "1f646-1f3fb",
                "key": ":ok_woman_tone1:"
            },
            "ok_woman_tone2": {
                "unicode": "1f646-1f3fc",
                "key": ":ok_woman_tone2:"
            },
            "ok_woman_tone3": {
                "unicode": "1f646-1f3fd",
                "key": ":ok_woman_tone3:"
            },
            "ok_woman_tone4": {
                "unicode": "1f646-1f3fe",
                "key": ":ok_woman_tone4:"
            },
            "ok_woman_tone5": {
                "unicode": "1f646-1f3ff",
                "key": ":ok_woman_tone5:"
            },
            "older_man": {
                "unicode": "1f474",
                "key": ":older_man:"
            },
            "older_man_tone1": {
                "unicode": "1f474-1f3fb",
                "key": ":older_man_tone1:"
            },
            "older_man_tone2": {
                "unicode": "1f474-1f3fc",
                "key": ":older_man_tone2:"
            },
            "older_man_tone3": {
                "unicode": "1f474-1f3fd",
                "key": ":older_man_tone3:"
            },
            "older_man_tone4": {
                "unicode": "1f474-1f3fe",
                "key": ":older_man_tone4:"
            },
            "older_man_tone5": {
                "unicode": "1f474-1f3ff",
                "key": ":older_man_tone5:"
            },
            "older_woman": {
                "unicode": "1f475",
                "key": ":older_woman:"
            },
            "older_woman_tone1": {
                "unicode": "1f475-1f3fb",
                "key": ":older_woman_tone1:"
            },
            "older_woman_tone2": {
                "unicode": "1f475-1f3fc",
                "key": ":older_woman_tone2:"
            },
            "older_woman_tone3": {
                "unicode": "1f475-1f3fd",
                "key": ":older_woman_tone3:"
            },
            "older_woman_tone4": {
                "unicode": "1f475-1f3fe",
                "key": ":older_woman_tone4:"
            },
            "older_woman_tone5": {
                "unicode": "1f475-1f3ff",
                "key": ":older_woman_tone5:"
            },
            "om_symbol": {
                "unicode": "1f549",
                "key": ":om_symbol:"
            },
            "on": {
                "unicode": "1f51b",
                "key": ":on:"
            },
            "oncoming_automobile": {
                "unicode": "1f698",
                "key": ":oncoming_automobile:"
            },
            "oncoming_bus": {
                "unicode": "1f68d",
                "key": ":oncoming_bus:"
            },
            "oncoming_police_car": {
                "unicode": "1f694",
                "key": ":oncoming_police_car:"
            },
            "oncoming_taxi": {
                "unicode": "1f696",
                "key": ":oncoming_taxi:"
            },
            "one": {
                "unicode": "0031-20e3",
                "key": ":one:"
            },
            "open_file_folder": {
                "unicode": "1f4c2",
                "key": ":open_file_folder:"
            },
            "open_hands": {
                "unicode": "1f450",
                "key": ":open_hands:"
            },
            "open_hands_tone1": {
                "unicode": "1f450-1f3fb",
                "key": ":open_hands_tone1:"
            },
            "open_hands_tone2": {
                "unicode": "1f450-1f3fc",
                "key": ":open_hands_tone2:"
            },
            "open_hands_tone3": {
                "unicode": "1f450-1f3fd",
                "key": ":open_hands_tone3:"
            },
            "open_hands_tone4": {
                "unicode": "1f450-1f3fe",
                "key": ":open_hands_tone4:"
            },
            "open_hands_tone5": {
                "unicode": "1f450-1f3ff",
                "key": ":open_hands_tone5:"
            },
            "open_mouth": {
                "unicode": "1f62e",
                "key": ":open_mouth:"
            },
            "ophiuchus": {
                "unicode": "26ce",
                "key": ":ophiuchus:"
            },
            "orange_book": {
                "unicode": "1f4d9",
                "key": ":orange_book:"
            },
            "orthodox_cross": {
                "unicode": "2626",
                "key": ":orthodox_cross:"
            },
            "outbox_tray": {
                "unicode": "1f4e4",
                "key": ":outbox_tray:"
            },
            "owl": {
                "unicode": "1f989",
                "key": ":owl:"
            },
            "ox": {
                "unicode": "1f402",
                "key": ":ox:"
            },
            "package": {
                "unicode": "1f4e6",
                "key": ":package:"
            },
            "page_facing_up": {
                "unicode": "1f4c4",
                "key": ":page_facing_up:"
            },
            "page_with_curl": {
                "unicode": "1f4c3",
                "key": ":page_with_curl:"
            },
            "pager": {
                "unicode": "1f4df",
                "key": ":pager:"
            },
            "paintbrush": {
                "unicode": "1f58c",
                "key": ":paintbrush:"
            },
            "palm_tree": {
                "unicode": "1f334",
                "key": ":palm_tree:"
            },
            "pancakes": {
                "unicode": "1f95e",
                "key": ":pancakes:"
            },
            "panda_face": {
                "unicode": "1f43c",
                "key": ":panda_face:"
            },
            "paperclip": {
                "unicode": "1f4ce",
                "key": ":paperclip:"
            },
            "paperclips": {
                "unicode": "1f587",
                "key": ":paperclips:"
            },
            "park": {
                "unicode": "1f3de",
                "key": ":park:"
            },
            "parking": {
                "unicode": "1f17f",
                "key": ":parking:"
            },
            "part_alternation_mark": {
                "unicode": "303d",
                "key": ":part_alternation_mark:"
            },
            "partly_sunny": {
                "unicode": "26c5",
                "key": ":partly_sunny:"
            },
            "passport_control": {
                "unicode": "1f6c2",
                "key": ":passport_control:"
            },
            "pause_button": {
                "unicode": "23f8",
                "key": ":pause_button:"
            },
            "peace": {
                "unicode": "262e",
                "key": ":peace:"
            },
            "peach": {
                "unicode": "1f351",
                "key": ":peach:"
            },
            "peanuts": {
                "unicode": "1f95c",
                "key": ":peanuts:"
            },
            "pear": {
                "unicode": "1f350",
                "key": ":pear:"
            },
            "pen_ballpoint": {
                "unicode": "1f58a",
                "key": ":pen_ballpoint:"
            },
            "pen_fountain": {
                "unicode": "1f58b",
                "key": ":pen_fountain:"
            },
            "pencil": {
                "unicode": "1f4dd",
                "key": ":pencil:"
            },
            "pencil2": {
                "unicode": "270f",
                "key": ":pencil2:"
            },
            "penguin": {
                "unicode": "1f427",
                "key": ":penguin:"
            },
            "pensive": {
                "unicode": "1f614",
                "key": ":pensive:"
            },
            "performing_arts": {
                "unicode": "1f3ad",
                "key": ":performing_arts:"
            },
            "persevere": {
                "unicode": "1f623",
                "key": ":persevere:"
            },
            "person_frowning": {
                "unicode": "1f64d",
                "key": ":person_frowning:"
            },
            "person_frowning_tone1": {
                "unicode": "1f64d-1f3fb",
                "key": ":person_frowning_tone1:"
            },
            "person_frowning_tone2": {
                "unicode": "1f64d-1f3fc",
                "key": ":person_frowning_tone2:"
            },
            "person_frowning_tone3": {
                "unicode": "1f64d-1f3fd",
                "key": ":person_frowning_tone3:"
            },
            "person_frowning_tone4": {
                "unicode": "1f64d-1f3fe",
                "key": ":person_frowning_tone4:"
            },
            "person_frowning_tone5": {
                "unicode": "1f64d-1f3ff",
                "key": ":person_frowning_tone5:"
            },
            "person_with_blond_hair": {
                "unicode": "1f471",
                "key": ":person_with_blond_hair:"
            },
            "person_with_blond_hair_tone1": {
                "unicode": "1f471-1f3fb",
                "key": ":person_with_blond_hair_tone1:"
            },
            "person_with_blond_hair_tone2": {
                "unicode": "1f471-1f3fc",
                "key": ":person_with_blond_hair_tone2:"
            },
            "person_with_blond_hair_tone3": {
                "unicode": "1f471-1f3fd",
                "key": ":person_with_blond_hair_tone3:"
            },
            "person_with_blond_hair_tone4": {
                "unicode": "1f471-1f3fe",
                "key": ":person_with_blond_hair_tone4:"
            },
            "person_with_blond_hair_tone5": {
                "unicode": "1f471-1f3ff",
                "key": ":person_with_blond_hair_tone5:"
            },
            "person_with_pouting_face": {
                "unicode": "1f64e",
                "key": ":person_with_pouting_face:"
            },
            "person_with_pouting_face_tone1": {
                "unicode": "1f64e-1f3fb",
                "key": ":person_with_pouting_face_tone1:"
            },
            "person_with_pouting_face_tone2": {
                "unicode": "1f64e-1f3fc",
                "key": ":person_with_pouting_face_tone2:"
            },
            "person_with_pouting_face_tone3": {
                "unicode": "1f64e-1f3fd",
                "key": ":person_with_pouting_face_tone3:"
            },
            "person_with_pouting_face_tone4": {
                "unicode": "1f64e-1f3fe",
                "key": ":person_with_pouting_face_tone4:"
            },
            "person_with_pouting_face_tone5": {
                "unicode": "1f64e-1f3ff",
                "key": ":person_with_pouting_face_tone5:"
            },
            "pick": {
                "unicode": "26cf",
                "key": ":pick:"
            },
            "pig": {
                "unicode": "1f437",
                "key": ":pig:"
            },
            "pig2": {
                "unicode": "1f416",
                "key": ":pig2:"
            },
            "pig_nose": {
                "unicode": "1f43d",
                "key": ":pig_nose:"
            },
            "pill": {
                "unicode": "1f48a",
                "key": ":pill:"
            },
            "pineapple": {
                "unicode": "1f34d",
                "key": ":pineapple:"
            },
            "ping_pong": {
                "unicode": "1f3d3",
                "key": ":ping_pong:"
            },
            "pisces": {
                "unicode": "2653",
                "key": ":pisces:"
            },
            "pizza": {
                "unicode": "1f355",
                "key": ":pizza:"
            },
            "place_of_worship": {
                "unicode": "1f6d0",
                "key": ":place_of_worship:"
            },
            "play_pause": {
                "unicode": "23ef",
                "key": ":play_pause:"
            },
            "point_down": {
                "unicode": "1f447",
                "key": ":point_down:"
            },
            "point_down_tone1": {
                "unicode": "1f447-1f3fb",
                "key": ":point_down_tone1:"
            },
            "point_down_tone2": {
                "unicode": "1f447-1f3fc",
                "key": ":point_down_tone2:"
            },
            "point_down_tone3": {
                "unicode": "1f447-1f3fd",
                "key": ":point_down_tone3:"
            },
            "point_down_tone4": {
                "unicode": "1f447-1f3fe",
                "key": ":point_down_tone4:"
            },
            "point_down_tone5": {
                "unicode": "1f447-1f3ff",
                "key": ":point_down_tone5:"
            },
            "point_left": {
                "unicode": "1f448",
                "key": ":point_left:"
            },
            "point_left_tone1": {
                "unicode": "1f448-1f3fb",
                "key": ":point_left_tone1:"
            },
            "point_left_tone2": {
                "unicode": "1f448-1f3fc",
                "key": ":point_left_tone2:"
            },
            "point_left_tone3": {
                "unicode": "1f448-1f3fd",
                "key": ":point_left_tone3:"
            },
            "point_left_tone4": {
                "unicode": "1f448-1f3fe",
                "key": ":point_left_tone4:"
            },
            "point_left_tone5": {
                "unicode": "1f448-1f3ff",
                "key": ":point_left_tone5:"
            },
            "point_right": {
                "unicode": "1f449",
                "key": ":point_right:"
            },
            "point_right_tone1": {
                "unicode": "1f449-1f3fb",
                "key": ":point_right_tone1:"
            },
            "point_right_tone2": {
                "unicode": "1f449-1f3fc",
                "key": ":point_right_tone2:"
            },
            "point_right_tone3": {
                "unicode": "1f449-1f3fd",
                "key": ":point_right_tone3:"
            },
            "point_right_tone4": {
                "unicode": "1f449-1f3fe",
                "key": ":point_right_tone4:"
            },
            "point_right_tone5": {
                "unicode": "1f449-1f3ff",
                "key": ":point_right_tone5:"
            },
            "point_up": {
                "unicode": "261d",
                "key": ":point_up:"
            },
            "point_up_2": {
                "unicode": "1f446",
                "key": ":point_up_2:"
            },
            "point_up_2_tone1": {
                "unicode": "1f446-1f3fb",
                "key": ":point_up_2_tone1:"
            },
            "point_up_2_tone2": {
                "unicode": "1f446-1f3fc",
                "key": ":point_up_2_tone2:"
            },
            "point_up_2_tone3": {
                "unicode": "1f446-1f3fd",
                "key": ":point_up_2_tone3:"
            },
            "point_up_2_tone4": {
                "unicode": "1f446-1f3fe",
                "key": ":point_up_2_tone4:"
            },
            "point_up_2_tone5": {
                "unicode": "1f446-1f3ff",
                "key": ":point_up_2_tone5:"
            },
            "point_up_tone1": {
                "unicode": "261d-1f3fb",
                "key": ":point_up_tone1:"
            },
            "point_up_tone2": {
                "unicode": "261d-1f3fc",
                "key": ":point_up_tone2:"
            },
            "point_up_tone3": {
                "unicode": "261d-1f3fd",
                "key": ":point_up_tone3:"
            },
            "point_up_tone4": {
                "unicode": "261d-1f3fe",
                "key": ":point_up_tone4:"
            },
            "point_up_tone5": {
                "unicode": "261d-1f3ff",
                "key": ":point_up_tone5:"
            },
            "police_car": {
                "unicode": "1f693",
                "key": ":police_car:"
            },
            "poodle": {
                "unicode": "1f429",
                "key": ":poodle:"
            },
            "poop": {
                "unicode": "1f4a9",
                "key": ":poop:"
            },
            "popcorn": {
                "unicode": "1f37f",
                "key": ":popcorn:"
            },
            "post_office": {
                "unicode": "1f3e3",
                "key": ":post_office:"
            },
            "postal_horn": {
                "unicode": "1f4ef",
                "key": ":postal_horn:"
            },
            "postbox": {
                "unicode": "1f4ee",
                "key": ":postbox:"
            },
            "potable_water": {
                "unicode": "1f6b0",
                "key": ":potable_water:"
            },
            "potato": {
                "unicode": "1f954",
                "key": ":potato:"
            },
            "pouch": {
                "unicode": "1f45d",
                "key": ":pouch:"
            },
            "poultry_leg": {
                "unicode": "1f357",
                "key": ":poultry_leg:"
            },
            "pound": {
                "unicode": "1f4b7",
                "key": ":pound:"
            },
            "pouting_cat": {
                "unicode": "1f63e",
                "key": ":pouting_cat:"
            },
            "pray": {
                "unicode": "1f64f",
                "key": ":pray:"
            },
            "pray_tone1": {
                "unicode": "1f64f-1f3fb",
                "key": ":pray_tone1:"
            },
            "pray_tone2": {
                "unicode": "1f64f-1f3fc",
                "key": ":pray_tone2:"
            },
            "pray_tone3": {
                "unicode": "1f64f-1f3fd",
                "key": ":pray_tone3:"
            },
            "pray_tone4": {
                "unicode": "1f64f-1f3fe",
                "key": ":pray_tone4:"
            },
            "pray_tone5": {
                "unicode": "1f64f-1f3ff",
                "key": ":pray_tone5:"
            },
            "prayer_beads": {
                "unicode": "1f4ff",
                "key": ":prayer_beads:"
            },
            "pregnant_woman": {
                "unicode": "1f930",
                "key": ":pregnant_woman:"
            },
            "pregnant_woman_tone1": {
                "unicode": "1f930-1f3fb",
                "key": ":pregnant_woman_tone1:"
            },
            "pregnant_woman_tone2": {
                "unicode": "1f930-1f3fc",
                "key": ":pregnant_woman_tone2:"
            },
            "pregnant_woman_tone3": {
                "unicode": "1f930-1f3fd",
                "key": ":pregnant_woman_tone3:"
            },
            "pregnant_woman_tone4": {
                "unicode": "1f930-1f3fe",
                "key": ":pregnant_woman_tone4:"
            },
            "pregnant_woman_tone5": {
                "unicode": "1f930-1f3ff",
                "key": ":pregnant_woman_tone5:"
            },
            "prince": {
                "unicode": "1f934",
                "key": ":prince:"
            },
            "prince_tone1": {
                "unicode": "1f934-1f3fb",
                "key": ":prince_tone1:"
            },
            "prince_tone2": {
                "unicode": "1f934-1f3fc",
                "key": ":prince_tone2:"
            },
            "prince_tone3": {
                "unicode": "1f934-1f3fd",
                "key": ":prince_tone3:"
            },
            "prince_tone4": {
                "unicode": "1f934-1f3fe",
                "key": ":prince_tone4:"
            },
            "prince_tone5": {
                "unicode": "1f934-1f3ff",
                "key": ":prince_tone5:"
            },
            "princess": {
                "unicode": "1f478",
                "key": ":princess:"
            },
            "princess_tone1": {
                "unicode": "1f478-1f3fb",
                "key": ":princess_tone1:"
            },
            "princess_tone2": {
                "unicode": "1f478-1f3fc",
                "key": ":princess_tone2:"
            },
            "princess_tone3": {
                "unicode": "1f478-1f3fd",
                "key": ":princess_tone3:"
            },
            "princess_tone4": {
                "unicode": "1f478-1f3fe",
                "key": ":princess_tone4:"
            },
            "princess_tone5": {
                "unicode": "1f478-1f3ff",
                "key": ":princess_tone5:"
            },
            "printer": {
                "unicode": "1f5a8",
                "key": ":printer:"
            },
            "projector": {
                "unicode": "1f4fd",
                "key": ":projector:"
            },
            "punch": {
                "unicode": "1f44a",
                "key": ":punch:"
            },
            "punch_tone1": {
                "unicode": "1f44a-1f3fb",
                "key": ":punch_tone1:"
            },
            "punch_tone2": {
                "unicode": "1f44a-1f3fc",
                "key": ":punch_tone2:"
            },
            "punch_tone3": {
                "unicode": "1f44a-1f3fd",
                "key": ":punch_tone3:"
            },
            "punch_tone4": {
                "unicode": "1f44a-1f3fe",
                "key": ":punch_tone4:"
            },
            "punch_tone5": {
                "unicode": "1f44a-1f3ff",
                "key": ":punch_tone5:"
            },
            "purple_heart": {
                "unicode": "1f49c",
                "key": ":purple_heart:"
            },
            "purse": {
                "unicode": "1f45b",
                "key": ":purse:"
            },
            "pushpin": {
                "unicode": "1f4cc",
                "key": ":pushpin:"
            },
            "put_litter_in_its_place": {
                "unicode": "1f6ae",
                "key": ":put_litter_in_its_place:"
            },
            "question": {
                "unicode": "2753",
                "key": ":question:"
            },
            "rabbit": {
                "unicode": "1f430",
                "key": ":rabbit:"
            },
            "rabbit2": {
                "unicode": "1f407",
                "key": ":rabbit2:"
            },
            "race_car": {
                "unicode": "1f3ce",
                "key": ":race_car:"
            },
            "racehorse": {
                "unicode": "1f40e",
                "key": ":racehorse:"
            },
            "radio": {
                "unicode": "1f4fb",
                "key": ":radio:"
            },
            "radio_button": {
                "unicode": "1f518",
                "key": ":radio_button:"
            },
            "radioactive": {
                "unicode": "2622",
                "key": ":radioactive:"
            },
            "rage": {
                "unicode": "1f621",
                "key": ":rage:"
            },
            "railway_car": {
                "unicode": "1f683",
                "key": ":railway_car:"
            },
            "railway_track": {
                "unicode": "1f6e4",
                "key": ":railway_track:"
            },
            "rainbow": {
                "unicode": "1f308",
                "key": ":rainbow:"
            },
            "rainbow_flag": {
                "unicode": "1f3f3-1f308",
                "key": ":rainbow_flag:"
            },
            "raised_back_of_hand": {
                "unicode": "1f91a",
                "key": ":raised_back_of_hand:"
            },
            "raised_back_of_hand_tone1": {
                "unicode": "1f91a-1f3fb",
                "key": ":raised_back_of_hand_tone1:"
            },
            "raised_back_of_hand_tone2": {
                "unicode": "1f91a-1f3fc",
                "key": ":raised_back_of_hand_tone2:"
            },
            "raised_back_of_hand_tone3": {
                "unicode": "1f91a-1f3fd",
                "key": ":raised_back_of_hand_tone3:"
            },
            "raised_back_of_hand_tone4": {
                "unicode": "1f91a-1f3fe",
                "key": ":raised_back_of_hand_tone4:"
            },
            "raised_back_of_hand_tone5": {
                "unicode": "1f91a-1f3ff",
                "key": ":raised_back_of_hand_tone5:"
            },
            "raised_hand": {
                "unicode": "270b",
                "key": ":raised_hand:"
            },
            "raised_hand_tone1": {
                "unicode": "270b-1f3fb",
                "key": ":raised_hand_tone1:"
            },
            "raised_hand_tone2": {
                "unicode": "270b-1f3fc",
                "key": ":raised_hand_tone2:"
            },
            "raised_hand_tone3": {
                "unicode": "270b-1f3fd",
                "key": ":raised_hand_tone3:"
            },
            "raised_hand_tone4": {
                "unicode": "270b-1f3fe",
                "key": ":raised_hand_tone4:"
            },
            "raised_hand_tone5": {
                "unicode": "270b-1f3ff",
                "key": ":raised_hand_tone5:"
            },
            "raised_hands": {
                "unicode": "1f64c",
                "key": ":raised_hands:"
            },
            "raised_hands_tone1": {
                "unicode": "1f64c-1f3fb",
                "key": ":raised_hands_tone1:"
            },
            "raised_hands_tone2": {
                "unicode": "1f64c-1f3fc",
                "key": ":raised_hands_tone2:"
            },
            "raised_hands_tone3": {
                "unicode": "1f64c-1f3fd",
                "key": ":raised_hands_tone3:"
            },
            "raised_hands_tone4": {
                "unicode": "1f64c-1f3fe",
                "key": ":raised_hands_tone4:"
            },
            "raised_hands_tone5": {
                "unicode": "1f64c-1f3ff",
                "key": ":raised_hands_tone5:"
            },
            "raising_hand": {
                "unicode": "1f64b",
                "key": ":raising_hand:"
            },
            "raising_hand_tone1": {
                "unicode": "1f64b-1f3fb",
                "key": ":raising_hand_tone1:"
            },
            "raising_hand_tone2": {
                "unicode": "1f64b-1f3fc",
                "key": ":raising_hand_tone2:"
            },
            "raising_hand_tone3": {
                "unicode": "1f64b-1f3fd",
                "key": ":raising_hand_tone3:"
            },
            "raising_hand_tone4": {
                "unicode": "1f64b-1f3fe",
                "key": ":raising_hand_tone4:"
            },
            "raising_hand_tone5": {
                "unicode": "1f64b-1f3ff",
                "key": ":raising_hand_tone5:"
            },
            "ram": {
                "unicode": "1f40f",
                "key": ":ram:"
            },
            "ramen": {
                "unicode": "1f35c",
                "key": ":ramen:"
            },
            "rat": {
                "unicode": "1f400",
                "key": ":rat:"
            },
            "record_button": {
                "unicode": "23fa",
                "key": ":record_button:"
            },
            "recycle": {
                "unicode": "267b",
                "key": ":recycle:"
            },
            "red_car": {
                "unicode": "1f697",
                "key": ":red_car:"
            },
            "red_circle": {
                "unicode": "1f534",
                "key": ":red_circle:"
            },
            "regional_indicator_a": {
                "unicode": "1f1e6",
                "key": ":regional_indicator_a:"
            },
            "regional_indicator_b": {
                "unicode": "1f1e7",
                "key": ":regional_indicator_b:"
            },
            "regional_indicator_c": {
                "unicode": "1f1e8",
                "key": ":regional_indicator_c:"
            },
            "regional_indicator_d": {
                "unicode": "1f1e9",
                "key": ":regional_indicator_d:"
            },
            "regional_indicator_e": {
                "unicode": "1f1ea",
                "key": ":regional_indicator_e:"
            },
            "regional_indicator_f": {
                "unicode": "1f1eb",
                "key": ":regional_indicator_f:"
            },
            "regional_indicator_g": {
                "unicode": "1f1ec",
                "key": ":regional_indicator_g:"
            },
            "regional_indicator_h": {
                "unicode": "1f1ed",
                "key": ":regional_indicator_h:"
            },
            "regional_indicator_i": {
                "unicode": "1f1ee",
                "key": ":regional_indicator_i:"
            },
            "regional_indicator_j": {
                "unicode": "1f1ef",
                "key": ":regional_indicator_j:"
            },
            "regional_indicator_k": {
                "unicode": "1f1f0",
                "key": ":regional_indicator_k:"
            },
            "regional_indicator_l": {
                "unicode": "1f1f1",
                "key": ":regional_indicator_l:"
            },
            "regional_indicator_m": {
                "unicode": "1f1f2",
                "key": ":regional_indicator_m:"
            },
            "regional_indicator_n": {
                "unicode": "1f1f3",
                "key": ":regional_indicator_n:"
            },
            "regional_indicator_o": {
                "unicode": "1f1f4",
                "key": ":regional_indicator_o:"
            },
            "regional_indicator_p": {
                "unicode": "1f1f5",
                "key": ":regional_indicator_p:"
            },
            "regional_indicator_q": {
                "unicode": "1f1f6",
                "key": ":regional_indicator_q:"
            },
            "regional_indicator_r": {
                "unicode": "1f1f7",
                "key": ":regional_indicator_r:"
            },
            "regional_indicator_s": {
                "unicode": "1f1f8",
                "key": ":regional_indicator_s:"
            },
            "regional_indicator_t": {
                "unicode": "1f1f9",
                "key": ":regional_indicator_t:"
            },
            "regional_indicator_u": {
                "unicode": "1f1fa",
                "key": ":regional_indicator_u:"
            },
            "regional_indicator_v": {
                "unicode": "1f1fb",
                "key": ":regional_indicator_v:"
            },
            "regional_indicator_w": {
                "unicode": "1f1fc",
                "key": ":regional_indicator_w:"
            },
            "regional_indicator_x": {
                "unicode": "1f1fd",
                "key": ":regional_indicator_x:"
            },
            "regional_indicator_y": {
                "unicode": "1f1fe",
                "key": ":regional_indicator_y:"
            },
            "regional_indicator_z": {
                "unicode": "1f1ff",
                "key": ":regional_indicator_z:"
            },
            "registered": {
                "unicode": "00ae",
                "key": ":registered:"
            },
            "relaxed": {
                "unicode": "263a",
                "key": ":relaxed:"
            },
            "relieved": {
                "unicode": "1f60c",
                "key": ":relieved:"
            },
            "reminder_ribbon": {
                "unicode": "1f397",
                "key": ":reminder_ribbon:"
            },
            "repeat": {
                "unicode": "1f501",
                "key": ":repeat:"
            },
            "repeat_one": {
                "unicode": "1f502",
                "key": ":repeat_one:"
            },
            "restroom": {
                "unicode": "1f6bb",
                "key": ":restroom:"
            },
            "revolving_hearts": {
                "unicode": "1f49e",
                "key": ":revolving_hearts:"
            },
            "rewind": {
                "unicode": "23ea",
                "key": ":rewind:"
            },
            "rhino": {
                "unicode": "1f98f",
                "key": ":rhino:"
            },
            "ribbon": {
                "unicode": "1f380",
                "key": ":ribbon:"
            },
            "rice": {
                "unicode": "1f35a",
                "key": ":rice:"
            },
            "rice_ball": {
                "unicode": "1f359",
                "key": ":rice_ball:"
            },
            "rice_cracker": {
                "unicode": "1f358",
                "key": ":rice_cracker:"
            },
            "rice_scene": {
                "unicode": "1f391",
                "key": ":rice_scene:"
            },
            "right_facing_fist": {
                "unicode": "1f91c",
                "key": ":right_facing_fist:"
            },
            "right_facing_fist_tone1": {
                "unicode": "1f91c-1f3fb",
                "key": ":right_facing_fist_tone1:"
            },
            "right_facing_fist_tone2": {
                "unicode": "1f91c-1f3fc",
                "key": ":right_facing_fist_tone2:"
            },
            "right_facing_fist_tone3": {
                "unicode": "1f91c-1f3fd",
                "key": ":right_facing_fist_tone3:"
            },
            "right_facing_fist_tone4": {
                "unicode": "1f91c-1f3fe",
                "key": ":right_facing_fist_tone4:"
            },
            "right_facing_fist_tone5": {
                "unicode": "1f91c-1f3ff",
                "key": ":right_facing_fist_tone5:"
            },
            "ring": {
                "unicode": "1f48d",
                "key": ":ring:"
            },
            "robot": {
                "unicode": "1f916",
                "key": ":robot:"
            },
            "rocket": {
                "unicode": "1f680",
                "key": ":rocket:"
            },
            "rofl": {
                "unicode": "1f923",
                "key": ":rofl:"
            },
            "roller_coaster": {
                "unicode": "1f3a2",
                "key": ":roller_coaster:"
            },
            "rolling_eyes": {
                "unicode": "1f644",
                "key": ":rolling_eyes:"
            },
            "rooster": {
                "unicode": "1f413",
                "key": ":rooster:"
            },
            "rose": {
                "unicode": "1f339",
                "key": ":rose:"
            },
            "rosette": {
                "unicode": "1f3f5",
                "key": ":rosette:"
            },
            "rotating_light": {
                "unicode": "1f6a8",
                "key": ":rotating_light:"
            },
            "round_pushpin": {
                "unicode": "1f4cd",
                "key": ":round_pushpin:"
            },
            "rowboat": {
                "unicode": "1f6a3",
                "key": ":rowboat:"
            },
            "rowboat_tone1": {
                "unicode": "1f6a3-1f3fb",
                "key": ":rowboat_tone1:"
            },
            "rowboat_tone2": {
                "unicode": "1f6a3-1f3fc",
                "key": ":rowboat_tone2:"
            },
            "rowboat_tone3": {
                "unicode": "1f6a3-1f3fd",
                "key": ":rowboat_tone3:"
            },
            "rowboat_tone4": {
                "unicode": "1f6a3-1f3fe",
                "key": ":rowboat_tone4:"
            },
            "rowboat_tone5": {
                "unicode": "1f6a3-1f3ff",
                "key": ":rowboat_tone5:"
            },
            "rugby_football": {
                "unicode": "1f3c9",
                "key": ":rugby_football:"
            },
            "runner": {
                "unicode": "1f3c3",
                "key": ":runner:"
            },
            "runner_tone1": {
                "unicode": "1f3c3-1f3fb",
                "key": ":runner_tone1:"
            },
            "runner_tone2": {
                "unicode": "1f3c3-1f3fc",
                "key": ":runner_tone2:"
            },
            "runner_tone3": {
                "unicode": "1f3c3-1f3fd",
                "key": ":runner_tone3:"
            },
            "runner_tone4": {
                "unicode": "1f3c3-1f3fe",
                "key": ":runner_tone4:"
            },
            "runner_tone5": {
                "unicode": "1f3c3-1f3ff",
                "key": ":runner_tone5:"
            },
            "running_shirt_with_sash": {
                "unicode": "1f3bd",
                "key": ":running_shirt_with_sash:"
            },
            "sa": {
                "unicode": "1f202",
                "key": ":sa:"
            },
            "sagittarius": {
                "unicode": "2650",
                "key": ":sagittarius:"
            },
            "sailboat": {
                "unicode": "26f5",
                "key": ":sailboat:"
            },
            "sake": {
                "unicode": "1f376",
                "key": ":sake:"
            },
            "salad": {
                "unicode": "1f957",
                "key": ":salad:"
            },
            "sandal": {
                "unicode": "1f461",
                "key": ":sandal:"
            },
            "santa": {
                "unicode": "1f385",
                "key": ":santa:"
            },
            "santa_tone1": {
                "unicode": "1f385-1f3fb",
                "key": ":santa_tone1:"
            },
            "santa_tone2": {
                "unicode": "1f385-1f3fc",
                "key": ":santa_tone2:"
            },
            "santa_tone3": {
                "unicode": "1f385-1f3fd",
                "key": ":santa_tone3:"
            },
            "santa_tone4": {
                "unicode": "1f385-1f3fe",
                "key": ":santa_tone4:"
            },
            "santa_tone5": {
                "unicode": "1f385-1f3ff",
                "key": ":santa_tone5:"
            },
            "satellite": {
                "unicode": "1f4e1",
                "key": ":satellite:"
            },
            "satellite_orbital": {
                "unicode": "1f6f0",
                "key": ":satellite_orbital:"
            },
            "saxophone": {
                "unicode": "1f3b7",
                "key": ":saxophone:"
            },
            "scales": {
                "unicode": "2696",
                "key": ":scales:"
            },
            "school": {
                "unicode": "1f3eb",
                "key": ":school:"
            },
            "school_satchel": {
                "unicode": "1f392",
                "key": ":school_satchel:"
            },
            "scissors": {
                "unicode": "2702",
                "key": ":scissors:"
            },
            "scooter": {
                "unicode": "1f6f4",
                "key": ":scooter:"
            },
            "scorpion": {
                "unicode": "1f982",
                "key": ":scorpion:"
            },
            "scorpius": {
                "unicode": "264f",
                "key": ":scorpius:"
            },
            "scream": {
                "unicode": "1f631",
                "key": ":scream:"
            },
            "scream_cat": {
                "unicode": "1f640",
                "key": ":scream_cat:"
            },
            "scroll": {
                "unicode": "1f4dc",
                "key": ":scroll:"
            },
            "seat": {
                "unicode": "1f4ba",
                "key": ":seat:"
            },
            "second_place": {
                "unicode": "1f948",
                "key": ":second_place:"
            },
            "secret": {
                "unicode": "3299",
                "key": ":secret:"
            },
            "see_no_evil": {
                "unicode": "1f648",
                "key": ":see_no_evil:"
            },
            "seedling": {
                "unicode": "1f331",
                "key": ":seedling:"
            },
            "selfie": {
                "unicode": "1f933",
                "key": ":selfie:"
            },
            "selfie_tone1": {
                "unicode": "1f933-1f3fb",
                "key": ":selfie_tone1:"
            },
            "selfie_tone2": {
                "unicode": "1f933-1f3fc",
                "key": ":selfie_tone2:"
            },
            "selfie_tone3": {
                "unicode": "1f933-1f3fd",
                "key": ":selfie_tone3:"
            },
            "selfie_tone4": {
                "unicode": "1f933-1f3fe",
                "key": ":selfie_tone4:"
            },
            "selfie_tone5": {
                "unicode": "1f933-1f3ff",
                "key": ":selfie_tone5:"
            },
            "seven": {
                "unicode": "0037-20e3",
                "key": ":seven:"
            },
            "shallow_pan_of_food": {
                "unicode": "1f958",
                "key": ":shallow_pan_of_food:"
            },
            "shamrock": {
                "unicode": "2618",
                "key": ":shamrock:"
            },
            "shark": {
                "unicode": "1f988",
                "key": ":shark:"
            },
            "shaved_ice": {
                "unicode": "1f367",
                "key": ":shaved_ice:"
            },
            "sheep": {
                "unicode": "1f411",
                "key": ":sheep:"
            },
            "shell": {
                "unicode": "1f41a",
                "key": ":shell:"
            },
            "shield": {
                "unicode": "1f6e1",
                "key": ":shield:"
            },
            "shinto_shrine": {
                "unicode": "26e9",
                "key": ":shinto_shrine:"
            },
            "ship": {
                "unicode": "1f6a2",
                "key": ":ship:"
            },
            "shirt": {
                "unicode": "1f455",
                "key": ":shirt:"
            },
            "shopping_bags": {
                "unicode": "1f6cd",
                "key": ":shopping_bags:"
            },
            "shopping_cart": {
                "unicode": "1f6d2",
                "key": ":shopping_cart:"
            },
            "shower": {
                "unicode": "1f6bf",
                "key": ":shower:"
            },
            "shrimp": {
                "unicode": "1f990",
                "key": ":shrimp:"
            },
            "shrug": {
                "unicode": "1f937",
                "key": ":shrug:"
            },
            "shrug_tone1": {
                "unicode": "1f937-1f3fb",
                "key": ":shrug_tone1:"
            },
            "shrug_tone2": {
                "unicode": "1f937-1f3fc",
                "key": ":shrug_tone2:"
            },
            "shrug_tone3": {
                "unicode": "1f937-1f3fd",
                "key": ":shrug_tone3:"
            },
            "shrug_tone4": {
                "unicode": "1f937-1f3fe",
                "key": ":shrug_tone4:"
            },
            "shrug_tone5": {
                "unicode": "1f937-1f3ff",
                "key": ":shrug_tone5:"
            },
            "signal_strength": {
                "unicode": "1f4f6",
                "key": ":signal_strength:"
            },
            "six": {
                "unicode": "0036-20e3",
                "key": ":six:"
            },
            "six_pointed_star": {
                "unicode": "1f52f",
                "key": ":six_pointed_star:"
            },
            "ski": {
                "unicode": "1f3bf",
                "key": ":ski:"
            },
            "skier": {
                "unicode": "26f7",
                "key": ":skier:"
            },
            "skull": {
                "unicode": "1f480",
                "key": ":skull:"
            },
            "skull_crossbones": {
                "unicode": "2620",
                "key": ":skull_crossbones:"
            },
            "sleeping": {
                "unicode": "1f634",
                "key": ":sleeping:"
            },
            "sleeping_accommodation": {
                "unicode": "1f6cc",
                "key": ":sleeping_accommodation:"
            },
            "sleepy": {
                "unicode": "1f62a",
                "key": ":sleepy:"
            },
            "slight_frown": {
                "unicode": "1f641",
                "key": ":slight_frown:"
            },
            "slight_smile": {
                "unicode": "1f642",
                "key": ":slight_smile:"
            },
            "slot_machine": {
                "unicode": "1f3b0",
                "key": ":slot_machine:"
            },
            "small_blue_diamond": {
                "unicode": "1f539",
                "key": ":small_blue_diamond:"
            },
            "small_orange_diamond": {
                "unicode": "1f538",
                "key": ":small_orange_diamond:"
            },
            "small_red_triangle": {
                "unicode": "1f53a",
                "key": ":small_red_triangle:"
            },
            "small_red_triangle_down": {
                "unicode": "1f53b",
                "key": ":small_red_triangle_down:"
            },
            "smile": {
                "unicode": "1f604",
                "key": ":smile:"
            },
            "smile_cat": {
                "unicode": "1f638",
                "key": ":smile_cat:"
            },
            "smiley": {
                "unicode": "1f603",
                "key": ":smiley:"
            },
            "smiley_cat": {
                "unicode": "1f63a",
                "key": ":smiley_cat:"
            },
            "smiling_imp": {
                "unicode": "1f608",
                "key": ":smiling_imp:"
            },
            "smirk": {
                "unicode": "1f60f",
                "key": ":smirk:"
            },
            "smirk_cat": {
                "unicode": "1f63c",
                "key": ":smirk_cat:"
            },
            "smoking": {
                "unicode": "1f6ac",
                "key": ":smoking:"
            },
            "snail": {
                "unicode": "1f40c",
                "key": ":snail:"
            },
            "snake": {
                "unicode": "1f40d",
                "key": ":snake:"
            },
            "sneezing_face": {
                "unicode": "1f927",
                "key": ":sneezing_face:"
            },
            "snowboarder": {
                "unicode": "1f3c2",
                "key": ":snowboarder:"
            },
            "snowflake": {
                "unicode": "2744",
                "key": ":snowflake:"
            },
            "snowman": {
                "unicode": "26c4",
                "key": ":snowman:"
            },
            "snowman2": {
                "unicode": "2603",
                "key": ":snowman2:"
            },
            "sob": {
                "unicode": "1f62d",
                "key": ":sob:"
            },
            "soccer": {
                "unicode": "26bd",
                "key": ":soccer:"
            },
            "soon": {
                "unicode": "1f51c",
                "key": ":soon:"
            },
            "sos": {
                "unicode": "1f198",
                "key": ":sos:"
            },
            "sound": {
                "unicode": "1f509",
                "key": ":sound:"
            },
            "space_invader": {
                "unicode": "1f47e",
                "key": ":space_invader:"
            },
            "spades": {
                "unicode": "2660",
                "key": ":spades:"
            },
            "spaghetti": {
                "unicode": "1f35d",
                "key": ":spaghetti:"
            },
            "sparkle": {
                "unicode": "2747",
                "key": ":sparkle:"
            },
            "sparkler": {
                "unicode": "1f387",
                "key": ":sparkler:"
            },
            "sparkles": {
                "unicode": "2728",
                "key": ":sparkles:"
            },
            "sparkling_heart": {
                "unicode": "1f496",
                "key": ":sparkling_heart:"
            },
            "speak_no_evil": {
                "unicode": "1f64a",
                "key": ":speak_no_evil:"
            },
            "speaker": {
                "unicode": "1f508",
                "key": ":speaker:"
            },
            "speaking_head": {
                "unicode": "1f5e3",
                "key": ":speaking_head:"
            },
            "speech_balloon": {
                "unicode": "1f4ac",
                "key": ":speech_balloon:"
            },
            "speech_left": {
                "unicode": "1f5e8",
                "key": ":speech_left:"
            },
            "speedboat": {
                "unicode": "1f6a4",
                "key": ":speedboat:"
            },
            "spider": {
                "unicode": "1f577",
                "key": ":spider:"
            },
            "spider_web": {
                "unicode": "1f578",
                "key": ":spider_web:"
            },
            "spoon": {
                "unicode": "1f944",
                "key": ":spoon:"
            },
            "spy": {
                "unicode": "1f575",
                "key": ":spy:"
            },
            "spy_tone1": {
                "unicode": "1f575-1f3fb",
                "key": ":spy_tone1:"
            },
            "spy_tone2": {
                "unicode": "1f575-1f3fc",
                "key": ":spy_tone2:"
            },
            "spy_tone3": {
                "unicode": "1f575-1f3fd",
                "key": ":spy_tone3:"
            },
            "spy_tone4": {
                "unicode": "1f575-1f3fe",
                "key": ":spy_tone4:"
            },
            "spy_tone5": {
                "unicode": "1f575-1f3ff",
                "key": ":spy_tone5:"
            },
            "squid": {
                "unicode": "1f991",
                "key": ":squid:"
            },
            "stadium": {
                "unicode": "1f3df",
                "key": ":stadium:"
            },
            "star": {
                "unicode": "2b50",
                "key": ":star:"
            },
            "star2": {
                "unicode": "1f31f",
                "key": ":star2:"
            },
            "star_and_crescent": {
                "unicode": "262a",
                "key": ":star_and_crescent:"
            },
            "star_of_david": {
                "unicode": "2721",
                "key": ":star_of_david:"
            },
            "stars": {
                "unicode": "1f320",
                "key": ":stars:"
            },
            "station": {
                "unicode": "1f689",
                "key": ":station:"
            },
            "statue_of_liberty": {
                "unicode": "1f5fd",
                "key": ":statue_of_liberty:"
            },
            "steam_locomotive": {
                "unicode": "1f682",
                "key": ":steam_locomotive:"
            },
            "stew": {
                "unicode": "1f372",
                "key": ":stew:"
            },
            "stop_button": {
                "unicode": "23f9",
                "key": ":stop_button:"
            },
            "stopwatch": {
                "unicode": "23f1",
                "key": ":stopwatch:"
            },
            "straight_ruler": {
                "unicode": "1f4cf",
                "key": ":straight_ruler:"
            },
            "strawberry": {
                "unicode": "1f353",
                "key": ":strawberry:"
            },
            "stuck_out_tongue": {
                "unicode": "1f61b",
                "key": ":stuck_out_tongue:"
            },
            "stuck_out_tongue_closed_eyes": {
                "unicode": "1f61d",
                "key": ":stuck_out_tongue_closed_eyes:"
            },
            "stuck_out_tongue_winking_eye": {
                "unicode": "1f61c",
                "key": ":stuck_out_tongue_winking_eye:"
            },
            "stuffed_flatbread": {
                "unicode": "1f959",
                "key": ":stuffed_flatbread:"
            },
            "sun_with_face": {
                "unicode": "1f31e",
                "key": ":sun_with_face:"
            },
            "sunflower": {
                "unicode": "1f33b",
                "key": ":sunflower:"
            },
            "sunglasses": {
                "unicode": "1f60e",
                "key": ":sunglasses:"
            },
            "sunny": {
                "unicode": "2600",
                "key": ":sunny:"
            },
            "sunrise": {
                "unicode": "1f305",
                "key": ":sunrise:"
            },
            "sunrise_over_mountains": {
                "unicode": "1f304",
                "key": ":sunrise_over_mountains:"
            },
            "surfer": {
                "unicode": "1f3c4",
                "key": ":surfer:"
            },
            "surfer_tone1": {
                "unicode": "1f3c4-1f3fb",
                "key": ":surfer_tone1:"
            },
            "surfer_tone2": {
                "unicode": "1f3c4-1f3fc",
                "key": ":surfer_tone2:"
            },
            "surfer_tone3": {
                "unicode": "1f3c4-1f3fd",
                "key": ":surfer_tone3:"
            },
            "surfer_tone4": {
                "unicode": "1f3c4-1f3fe",
                "key": ":surfer_tone4:"
            },
            "surfer_tone5": {
                "unicode": "1f3c4-1f3ff",
                "key": ":surfer_tone5:"
            },
            "sushi": {
                "unicode": "1f363",
                "key": ":sushi:"
            },
            "suspension_railway": {
                "unicode": "1f69f",
                "key": ":suspension_railway:"
            },
            "sweat": {
                "unicode": "1f613",
                "key": ":sweat:"
            },
            "sweat_drops": {
                "unicode": "1f4a6",
                "key": ":sweat_drops:"
            },
            "sweat_smile": {
                "unicode": "1f605",
                "key": ":sweat_smile:"
            },
            "sweet_potato": {
                "unicode": "1f360",
                "key": ":sweet_potato:"
            },
            "swimmer": {
                "unicode": "1f3ca",
                "key": ":swimmer:"
            },
            "swimmer_tone1": {
                "unicode": "1f3ca-1f3fb",
                "key": ":swimmer_tone1:"
            },
            "swimmer_tone2": {
                "unicode": "1f3ca-1f3fc",
                "key": ":swimmer_tone2:"
            },
            "swimmer_tone3": {
                "unicode": "1f3ca-1f3fd",
                "key": ":swimmer_tone3:"
            },
            "swimmer_tone4": {
                "unicode": "1f3ca-1f3fe",
                "key": ":swimmer_tone4:"
            },
            "swimmer_tone5": {
                "unicode": "1f3ca-1f3ff",
                "key": ":swimmer_tone5:"
            },
            "symbols": {
                "unicode": "1f523",
                "key": ":symbols:"
            },
            "synagogue": {
                "unicode": "1f54d",
                "key": ":synagogue:"
            },
            "syringe": {
                "unicode": "1f489",
                "key": ":syringe:"
            },
            "taco": {
                "unicode": "1f32e",
                "key": ":taco:"
            },
            "tada": {
                "unicode": "1f389",
                "key": ":tada:"
            },
            "tanabata_tree": {
                "unicode": "1f38b",
                "key": ":tanabata_tree:"
            },
            "tangerine": {
                "unicode": "1f34a",
                "key": ":tangerine:"
            },
            "taurus": {
                "unicode": "2649",
                "key": ":taurus:"
            },
            "taxi": {
                "unicode": "1f695",
                "key": ":taxi:"
            },
            "tea": {
                "unicode": "1f375",
                "key": ":tea:"
            },
            "telephone": {
                "unicode": "260e",
                "key": ":telephone:"
            },
            "telephone_receiver": {
                "unicode": "1f4de",
                "key": ":telephone_receiver:"
            },
            "telescope": {
                "unicode": "1f52d",
                "key": ":telescope:"
            },
            "tennis": {
                "unicode": "1f3be",
                "key": ":tennis:"
            },
            "tent": {
                "unicode": "26fa",
                "key": ":tent:"
            },
            "thermometer": {
                "unicode": "1f321",
                "key": ":thermometer:"
            },
            "thermometer_face": {
                "unicode": "1f912",
                "key": ":thermometer_face:"
            },
            "thinking": {
                "unicode": "1f914",
                "key": ":thinking:"
            },
            "third_place": {
                "unicode": "1f949",
                "key": ":third_place:"
            },
            "thought_balloon": {
                "unicode": "1f4ad",
                "key": ":thought_balloon:"
            },
            "three": {
                "unicode": "0033-20e3",
                "key": ":three:"
            },
            "thumbsdown": {
                "unicode": "1f44e",
                "key": ":thumbsdown:"
            },
            "thumbsdown_tone1": {
                "unicode": "1f44e-1f3fb",
                "key": ":thumbsdown_tone1:"
            },
            "thumbsdown_tone2": {
                "unicode": "1f44e-1f3fc",
                "key": ":thumbsdown_tone2:"
            },
            "thumbsdown_tone3": {
                "unicode": "1f44e-1f3fd",
                "key": ":thumbsdown_tone3:"
            },
            "thumbsdown_tone4": {
                "unicode": "1f44e-1f3fe",
                "key": ":thumbsdown_tone4:"
            },
            "thumbsdown_tone5": {
                "unicode": "1f44e-1f3ff",
                "key": ":thumbsdown_tone5:"
            },
            "thumbsup": {
                "unicode": "1f44d",
                "key": ":thumbsup:"
            },
            "thumbsup_tone1": {
                "unicode": "1f44d-1f3fb",
                "key": ":thumbsup_tone1:"
            },
            "thumbsup_tone2": {
                "unicode": "1f44d-1f3fc",
                "key": ":thumbsup_tone2:"
            },
            "thumbsup_tone3": {
                "unicode": "1f44d-1f3fd",
                "key": ":thumbsup_tone3:"
            },
            "thumbsup_tone4": {
                "unicode": "1f44d-1f3fe",
                "key": ":thumbsup_tone4:"
            },
            "thumbsup_tone5": {
                "unicode": "1f44d-1f3ff",
                "key": ":thumbsup_tone5:"
            },
            "thunder_cloud_rain": {
                "unicode": "26c8",
                "key": ":thunder_cloud_rain:"
            },
            "ticket": {
                "unicode": "1f3ab",
                "key": ":ticket:"
            },
            "tickets": {
                "unicode": "1f39f",
                "key": ":tickets:"
            },
            "tiger": {
                "unicode": "1f42f",
                "key": ":tiger:"
            },
            "tiger2": {
                "unicode": "1f405",
                "key": ":tiger2:"
            },
            "timer": {
                "unicode": "23f2",
                "key": ":timer:"
            },
            "tired_face": {
                "unicode": "1f62b",
                "key": ":tired_face:"
            },
            "tm": {
                "unicode": "2122",
                "key": ":tm:"
            },
            "toilet": {
                "unicode": "1f6bd",
                "key": ":toilet:"
            },
            "tokyo_tower": {
                "unicode": "1f5fc",
                "key": ":tokyo_tower:"
            },
            "tomato": {
                "unicode": "1f345",
                "key": ":tomato:"
            },
            "tone1": {
                "unicode": "1f3fb",
                "key": ":tone1:"
            },
            "tone2": {
                "unicode": "1f3fc",
                "key": ":tone2:"
            },
            "tone3": {
                "unicode": "1f3fd",
                "key": ":tone3:"
            },
            "tone4": {
                "unicode": "1f3fe",
                "key": ":tone4:"
            },
            "tone5": {
                "unicode": "1f3ff",
                "key": ":tone5:"
            },
            "tongue": {
                "unicode": "1f445",
                "key": ":tongue:"
            },
            "tools": {
                "unicode": "1f6e0",
                "key": ":tools:"
            },
            "top": {
                "unicode": "1f51d",
                "key": ":top:"
            },
            "tophat": {
                "unicode": "1f3a9",
                "key": ":tophat:"
            },
            "track_next": {
                "unicode": "23ed",
                "key": ":track_next:"
            },
            "track_previous": {
                "unicode": "23ee",
                "key": ":track_previous:"
            },
            "trackball": {
                "unicode": "1f5b2",
                "key": ":trackball:"
            },
            "tractor": {
                "unicode": "1f69c",
                "key": ":tractor:"
            },
            "traffic_light": {
                "unicode": "1f6a5",
                "key": ":traffic_light:"
            },
            "train": {
                "unicode": "1f68b",
                "key": ":train:"
            },
            "train2": {
                "unicode": "1f686",
                "key": ":train2:"
            },
            "tram": {
                "unicode": "1f68a",
                "key": ":tram:"
            },
            "triangular_flag_on_post": {
                "unicode": "1f6a9",
                "key": ":triangular_flag_on_post:"
            },
            "triangular_ruler": {
                "unicode": "1f4d0",
                "key": ":triangular_ruler:"
            },
            "trident": {
                "unicode": "1f531",
                "key": ":trident:"
            },
            "triumph": {
                "unicode": "1f624",
                "key": ":triumph:"
            },
            "trolleybus": {
                "unicode": "1f68e",
                "key": ":trolleybus:"
            },
            "trophy": {
                "unicode": "1f3c6",
                "key": ":trophy:"
            },
            "tropical_drink": {
                "unicode": "1f379",
                "key": ":tropical_drink:"
            },
            "tropical_fish": {
                "unicode": "1f420",
                "key": ":tropical_fish:"
            },
            "truck": {
                "unicode": "1f69a",
                "key": ":truck:"
            },
            "trumpet": {
                "unicode": "1f3ba",
                "key": ":trumpet:"
            },
            "tulip": {
                "unicode": "1f337",
                "key": ":tulip:"
            },
            "tumbler_glass": {
                "unicode": "1f943",
                "key": ":tumbler_glass:"
            },
            "turkey": {
                "unicode": "1f983",
                "key": ":turkey:"
            },
            "turtle": {
                "unicode": "1f422",
                "key": ":turtle:"
            },
            "tv": {
                "unicode": "1f4fa",
                "key": ":tv:"
            },
            "twisted_rightwards_arrows": {
                "unicode": "1f500",
                "key": ":twisted_rightwards_arrows:"
            },
            "two": {
                "unicode": "0032-20e3",
                "key": ":two:"
            },
            "two_hearts": {
                "unicode": "1f495",
                "key": ":two_hearts:"
            },
            "two_men_holding_hands": {
                "unicode": "1f46c",
                "key": ":two_men_holding_hands:"
            },
            "two_women_holding_hands": {
                "unicode": "1f46d",
                "key": ":two_women_holding_hands:"
            },
            "u5272": {
                "unicode": "1f239",
                "key": ":u5272:"
            },
            "u5408": {
                "unicode": "1f234",
                "key": ":u5408:"
            },
            "u55b6": {
                "unicode": "1f23a",
                "key": ":u55b6:"
            },
            "u6307": {
                "unicode": "1f22f",
                "key": ":u6307:"
            },
            "u6708": {
                "unicode": "1f237",
                "key": ":u6708:"
            },
            "u6709": {
                "unicode": "1f236",
                "key": ":u6709:"
            },
            "u6e80": {
                "unicode": "1f235",
                "key": ":u6e80:"
            },
            "u7121": {
                "unicode": "1f21a",
                "key": ":u7121:"
            },
            "u7533": {
                "unicode": "1f238",
                "key": ":u7533:"
            },
            "u7981": {
                "unicode": "1f232",
                "key": ":u7981:"
            },
            "u7a7a": {
                "unicode": "1f233",
                "key": ":u7a7a:"
            },
            "umbrella": {
                "unicode": "2614",
                "key": ":umbrella:"
            },
            "umbrella2": {
                "unicode": "2602",
                "key": ":umbrella2:"
            },
            "unamused": {
                "unicode": "1f612",
                "key": ":unamused:"
            },
            "underage": {
                "unicode": "1f51e",
                "key": ":underage:"
            },
            "unicorn": {
                "unicode": "1f984",
                "key": ":unicorn:"
            },
            "unlock": {
                "unicode": "1f513",
                "key": ":unlock:"
            },
            "up": {
                "unicode": "1f199",
                "key": ":up:"
            },
            "upside_down": {
                "unicode": "1f643",
                "key": ":upside_down:"
            },
            "urn": {
                "unicode": "26b1",
                "key": ":urn:"
            },
            "v": {
                "unicode": "270c",
                "key": ":v:"
            },
            "v_tone1": {
                "unicode": "270c-1f3fb",
                "key": ":v_tone1:"
            },
            "v_tone2": {
                "unicode": "270c-1f3fc",
                "key": ":v_tone2:"
            },
            "v_tone3": {
                "unicode": "270c-1f3fd",
                "key": ":v_tone3:"
            },
            "v_tone4": {
                "unicode": "270c-1f3fe",
                "key": ":v_tone4:"
            },
            "v_tone5": {
                "unicode": "270c-1f3ff",
                "key": ":v_tone5:"
            },
            "vertical_traffic_light": {
                "unicode": "1f6a6",
                "key": ":vertical_traffic_light:"
            },
            "vhs": {
                "unicode": "1f4fc",
                "key": ":vhs:"
            },
            "vibration_mode": {
                "unicode": "1f4f3",
                "key": ":vibration_mode:"
            },
            "video_camera": {
                "unicode": "1f4f9",
                "key": ":video_camera:"
            },
            "video_game": {
                "unicode": "1f3ae",
                "key": ":video_game:"
            },
            "violin": {
                "unicode": "1f3bb",
                "key": ":violin:"
            },
            "virgo": {
                "unicode": "264d",
                "key": ":virgo:"
            },
            "volcano": {
                "unicode": "1f30b",
                "key": ":volcano:"
            },
            "volleyball": {
                "unicode": "1f3d0",
                "key": ":volleyball:"
            },
            "vs": {
                "unicode": "1f19a",
                "key": ":vs:"
            },
            "vulcan": {
                "unicode": "1f596",
                "key": ":vulcan:"
            },
            "vulcan_tone1": {
                "unicode": "1f596-1f3fb",
                "key": ":vulcan_tone1:"
            },
            "vulcan_tone2": {
                "unicode": "1f596-1f3fc",
                "key": ":vulcan_tone2:"
            },
            "vulcan_tone3": {
                "unicode": "1f596-1f3fd",
                "key": ":vulcan_tone3:"
            },
            "vulcan_tone4": {
                "unicode": "1f596-1f3fe",
                "key": ":vulcan_tone4:"
            },
            "vulcan_tone5": {
                "unicode": "1f596-1f3ff",
                "key": ":vulcan_tone5:"
            },
            "walking": {
                "unicode": "1f6b6",
                "key": ":walking:"
            },
            "walking_tone1": {
                "unicode": "1f6b6-1f3fb",
                "key": ":walking_tone1:"
            },
            "walking_tone2": {
                "unicode": "1f6b6-1f3fc",
                "key": ":walking_tone2:"
            },
            "walking_tone3": {
                "unicode": "1f6b6-1f3fd",
                "key": ":walking_tone3:"
            },
            "walking_tone4": {
                "unicode": "1f6b6-1f3fe",
                "key": ":walking_tone4:"
            },
            "walking_tone5": {
                "unicode": "1f6b6-1f3ff",
                "key": ":walking_tone5:"
            },
            "waning_crescent_moon": {
                "unicode": "1f318",
                "key": ":waning_crescent_moon:"
            },
            "waning_gibbous_moon": {
                "unicode": "1f316",
                "key": ":waning_gibbous_moon:"
            },
            "warning": {
                "unicode": "26a0",
                "key": ":warning:"
            },
            "wastebasket": {
                "unicode": "1f5d1",
                "key": ":wastebasket:"
            },
            "watch": {
                "unicode": "231a",
                "key": ":watch:"
            },
            "water_buffalo": {
                "unicode": "1f403",
                "key": ":water_buffalo:"
            },
            "water_polo": {
                "unicode": "1f93d",
                "key": ":water_polo:"
            },
            "water_polo_tone1": {
                "unicode": "1f93d-1f3fb",
                "key": ":water_polo_tone1:"
            },
            "water_polo_tone2": {
                "unicode": "1f93d-1f3fc",
                "key": ":water_polo_tone2:"
            },
            "water_polo_tone3": {
                "unicode": "1f93d-1f3fd",
                "key": ":water_polo_tone3:"
            },
            "water_polo_tone4": {
                "unicode": "1f93d-1f3fe",
                "key": ":water_polo_tone4:"
            },
            "water_polo_tone5": {
                "unicode": "1f93d-1f3ff",
                "key": ":water_polo_tone5:"
            },
            "watermelon": {
                "unicode": "1f349",
                "key": ":watermelon:"
            },
            "wave": {
                "unicode": "1f44b",
                "key": ":wave:"
            },
            "wave_tone1": {
                "unicode": "1f44b-1f3fb",
                "key": ":wave_tone1:"
            },
            "wave_tone2": {
                "unicode": "1f44b-1f3fc",
                "key": ":wave_tone2:"
            },
            "wave_tone3": {
                "unicode": "1f44b-1f3fd",
                "key": ":wave_tone3:"
            },
            "wave_tone4": {
                "unicode": "1f44b-1f3fe",
                "key": ":wave_tone4:"
            },
            "wave_tone5": {
                "unicode": "1f44b-1f3ff",
                "key": ":wave_tone5:"
            },
            "wavy_dash": {
                "unicode": "3030",
                "key": ":wavy_dash:"
            },
            "waxing_crescent_moon": {
                "unicode": "1f312",
                "key": ":waxing_crescent_moon:"
            },
            "waxing_gibbous_moon": {
                "unicode": "1f314",
                "key": ":waxing_gibbous_moon:"
            },
            "wc": {
                "unicode": "1f6be",
                "key": ":wc:"
            },
            "weary": {
                "unicode": "1f629",
                "key": ":weary:"
            },
            "wedding": {
                "unicode": "1f492",
                "key": ":wedding:"
            },
            "whale": {
                "unicode": "1f433",
                "key": ":whale:"
            },
            "whale2": {
                "unicode": "1f40b",
                "key": ":whale2:"
            },
            "wheel_of_dharma": {
                "unicode": "2638",
                "key": ":wheel_of_dharma:"
            },
            "wheelchair": {
                "unicode": "267f",
                "key": ":wheelchair:"
            },
            "white_check_mark": {
                "unicode": "2705",
                "key": ":white_check_mark:"
            },
            "white_circle": {
                "unicode": "26aa",
                "key": ":white_circle:"
            },
            "white_flower": {
                "unicode": "1f4ae",
                "key": ":white_flower:"
            },
            "white_large_square": {
                "unicode": "2b1c",
                "key": ":white_large_square:"
            },
            "white_medium_small_square": {
                "unicode": "25fd",
                "key": ":white_medium_small_square:"
            },
            "white_medium_square": {
                "unicode": "25fb",
                "key": ":white_medium_square:"
            },
            "white_small_square": {
                "unicode": "25ab",
                "key": ":white_small_square:"
            },
            "white_square_button": {
                "unicode": "1f533",
                "key": ":white_square_button:"
            },
            "white_sun_cloud": {
                "unicode": "1f325",
                "key": ":white_sun_cloud:"
            },
            "white_sun_rain_cloud": {
                "unicode": "1f326",
                "key": ":white_sun_rain_cloud:"
            },
            "white_sun_small_cloud": {
                "unicode": "1f324",
                "key": ":white_sun_small_cloud:"
            },
            "wilted_rose": {
                "unicode": "1f940",
                "key": ":wilted_rose:"
            },
            "wind_blowing_face": {
                "unicode": "1f32c",
                "key": ":wind_blowing_face:"
            },
            "wind_chime": {
                "unicode": "1f390",
                "key": ":wind_chime:"
            },
            "wine_glass": {
                "unicode": "1f377",
                "key": ":wine_glass:"
            },
            "wink": {
                "unicode": "1f609",
                "key": ":wink:"
            },
            "wolf": {
                "unicode": "1f43a",
                "key": ":wolf:"
            },
            "woman": {
                "unicode": "1f469",
                "key": ":woman:"
            },
            "woman_tone1": {
                "unicode": "1f469-1f3fb",
                "key": ":woman_tone1:"
            },
            "woman_tone2": {
                "unicode": "1f469-1f3fc",
                "key": ":woman_tone2:"
            },
            "woman_tone3": {
                "unicode": "1f469-1f3fd",
                "key": ":woman_tone3:"
            },
            "woman_tone4": {
                "unicode": "1f469-1f3fe",
                "key": ":woman_tone4:"
            },
            "woman_tone5": {
                "unicode": "1f469-1f3ff",
                "key": ":woman_tone5:"
            },
            "womans_clothes": {
                "unicode": "1f45a",
                "key": ":womans_clothes:"
            },
            "womans_hat": {
                "unicode": "1f452",
                "key": ":womans_hat:"
            },
            "womens": {
                "unicode": "1f6ba",
                "key": ":womens:"
            },
            "worried": {
                "unicode": "1f61f",
                "key": ":worried:"
            },
            "wrench": {
                "unicode": "1f527",
                "key": ":wrench:"
            },
            "wrestlers": {
                "unicode": "1f93c",
                "key": ":wrestlers:"
            },
            "wrestlers_tone1": {
                "unicode": "1f93c-1f3fb",
                "key": ":wrestlers_tone1:"
            },
            "wrestlers_tone2": {
                "unicode": "1f93c-1f3fc",
                "key": ":wrestlers_tone2:"
            },
            "wrestlers_tone3": {
                "unicode": "1f93c-1f3fd",
                "key": ":wrestlers_tone3:"
            },
            "wrestlers_tone4": {
                "unicode": "1f93c-1f3fe",
                "key": ":wrestlers_tone4:"
            },
            "wrestlers_tone5": {
                "unicode": "1f93c-1f3ff",
                "key": ":wrestlers_tone5:"
            },
            "writing_hand": {
                "unicode": "270d",
                "key": ":writing_hand:"
            },
            "writing_hand_tone1": {
                "unicode": "270d-1f3fb",
                "key": ":writing_hand_tone1:"
            },
            "writing_hand_tone2": {
                "unicode": "270d-1f3fc",
                "key": ":writing_hand_tone2:"
            },
            "writing_hand_tone3": {
                "unicode": "270d-1f3fd",
                "key": ":writing_hand_tone3:"
            },
            "writing_hand_tone4": {
                "unicode": "270d-1f3fe",
                "key": ":writing_hand_tone4:"
            },
            "writing_hand_tone5": {
                "unicode": "270d-1f3ff",
                "key": ":writing_hand_tone5:"
            },
            "x": {
                "unicode": "274c",
                "key": ":x:"
            },
            "yellow_heart": {
                "unicode": "1f49b",
                "key": ":yellow_heart:"
            },
            "yen": {
                "unicode": "1f4b4",
                "key": ":yen:"
            },
            "yin_yang": {
                "unicode": "262f",
                "key": ":yin_yang:"
            },
            "yum": {
                "unicode": "1f60b",
                "key": ":yum:"
            },
            "zap": {
                "unicode": "26a1",
                "key": ":zap:"
            },
            "zero": {
                "unicode": "0030-20e3",
                "key": ":zero:"
            },
            "zipper_mouth": {
                "unicode": "1f910",
                "key": ":zipper_mouth:"
            },
            "zzz": {
                "unicode": "1f4a4",
                "key": ":zzz:"
            }
        },
        EMOTICONS: {
            '<3': '2764',
            '</3': '1f494',
            ':\')': '1f602',
            ':\'-)': '1f602',
            ':D': '1f603',
            ':-D': '1f603',
            '=D': '1f603',
            ':)': '1f642',
            ':))': '1f606',
            ':-))': '1f606',
            '=))': '1f606',
            ':-)': '1f642',
            '=]': '1f642',
            '=)': '1f642',
            ':]': '1f642',
            '\':)': '1f605',
            '\':-)': '1f605',
            '\'=)': '1f605',
            '\':D': '1f605',
            '\':-D': '1f605',
            '\'=D': '1f605',
            '>:)': '1f606',
            '>;)': '1f606',
            '>:-)': '1f606',
            '>=)': '1f606',
            ';)': '1f609',
            ';-)': '1f609',
            '*-)': '1f609',
            '*)': '1f609',
            ';-]': '1f609',
            ';]': '1f609',
            ';D': '1f609',
            ';^)': '1f609',
            '\':(': '1f613',
            '\':-(': '1f613',
            '\'=(': '1f613',
            ':*': '1f618',
            ':-*': '1f618',
            '=*': '1f618',
            ':^*': '1f618',
            '>:P': '1f61c',
            'X-P': '1f61c',
            'x-p': '1f61c',
            '>:[': '1f61e',
            ':-(': '1f61e',
            ':(': '1f61e',
            'qq': '1f62d',
            ':sad:': '1f62d',
            ':-[': '1f61e',
            ':[': '1f61e',
            '=(': '1f61e',
            '>:(': '1f620',
            '>:-(': '1f620',
            ':@': '1f620',
            ':\'(': '1f622',
            ':\'-(': '1f622',
            ';(': '1f622',
            ';-(': '1f622',
            '>.<': '1f623',
            'D:': '1f628',
            ':$': '1f633',
            '=$': '1f633',
            '#-)': '1f635',
            '#)': '1f635',
            '%-)': '1f635',
            '%)': '1f635',
            'X)': '1f635',
            'X-)': '1f635',
            '*\\0/*': '1f646',
            '\\0/': '1f646',
            '*\\O/*': '1f646',
            '\\O/': '1f646',
            'O:-)': '1f607',
            '0:-3': '1f607',
            '0:3': '1f607',
            '0:-)': '1f607',
            '0:)': '1f607',
            '0;^)': '1f607',
            'O:)': '1f607',
            'O;-)': '1f607',
            'O=)': '1f607',
            '0;-)': '1f607',
            'O:-3': '1f607',
            'O:3': '1f607',
            'B-)': '1f60e',
            'B)': '1f60e',
            '8)': '1f60e',
            '8-)': '1f60e',
            'B-D': '1f60e',
            '8-D': '1f60e',
            '-_-': '1f611',
            '-__-': '1f611',
            '-___-': '1f611',
            '>:\\': '1f615',
            '>:/': '1f615',
            ':-/': '1f615',
            ':-.': '1f615',
            ':/': '1f615',
            ':\\': '1f615',
            '=/': '1f615',
            '=\\': '1f615',
            ':L': '1f615',
            '=L': '1f615',
            ':P': '1f61b',
            ':-P': '1f61b',
            '=P': '1f61b',
            ':-p': '1f61b',
            ':p': '1f61b',
            '=p': '1f61b',
            ':-Þ': '1f61b',
            ':Þ': '1f61b',
            ':þ': '1f61b',
            ':-þ': '1f61b',
            ':-b': '1f61b',
            ':b': '1f61b',
            'd:': '1f61b',
            ':-O': '1f62e',
            ':O': '1f62e',
            ':-o': '1f62e',
            ':o': '1f62e',
            'O_O': '1f62e',
            '>:O': '1f62e',
            ':-X': '1f636',
            ':X': '1f636',
            ':-#': '1f636',
            ':#': '1f636',
            '=X': '1f636',
            '=x': '1f636',
            ':x': '1f636',
            ':-x': '1f636',
            '=#': '1f636',
            ':shit:': '1f4a9',
        }
    }

    Object.assign(DATA.EMOJI, {
        csa: {
            key: ":csa:",
            svgData: '<g><rect width="64px" height="64px" /> <path d="M 30.805000000000003 45.790000000000006 l 0 -5.32 l -6.6850000000000005 0 l 6.6850000000000005 -11.55 l 6.6850000000000005 11.55 l -6.6850000000000005 0 l 0 5.32 l 8.995000000000001 0 l 6.055000000000001 3.5000000000000004 a 6.790000000000001 6.790000000000001 0 1 0 3.5000000000000004 -6.055000000000001 l -6.055000000000001 -3.5000000000000004 l -8.96 -16.240000000000002 l 0 -7.000000000000001 a 6.790000000000001 6.790000000000001 0 1 0 -7.000000000000001 0 l 0 7.000000000000001 l -8.96 16.240000000000002 l -6.055000000000001 3.5000000000000004 a 6.790000000000001 6.790000000000001 0 1 0 3.5000000000000004 6.055000000000001 l 6.055000000000001 -3.5000000000000004  z" fill="white" /></g>',
            unicode: ""
        },
        flag_ara: {
            key: ":flag_ara:",
            svgData: '<g><ellipse ry="32" rx="32" cy="32" cx="32" stroke-width="0" stroke="#000" fill="green"/><text text-anchor="middle" dy="0.35em" font-family="Helvetica, Arial, sans-serif" font-size="20" y="32" x="32" stroke-width="0" stroke="#000" fill="#ffffff">العربية</text></g>',
            unicode: ""
        },
    });

    if (!self.EmojiData ? .isFull) {
        self.EmojiData = Object.assign(self.EmojiData || {}, DATA);
    }
})();