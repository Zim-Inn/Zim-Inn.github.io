import pack from "../lib/pack.js";

const CArtifactDeckEncoder = (() => {
  const s_nCurrentVersion = 2;
  const sm_rgchEncodedPrefix = "RTFACT";
  const sm_nMaxBytesForVarUint32 = 5;
  const knHeaderSize = 3;

  const ContinuousVars = new Array();

  // Valve: signature cards for heroes SHOULD NOT be included in "cards"
  const EncodeDeck = (deckContents) => {
    if (!deckContents) {
      return false;
    }

    const bytes = EncodeBytes(deckContents);
    if (!bytes) {
      return false;
    } else {
      const deck_code = EncodeBytesToString(bytes);
      return deck_code;
    }
  };

  const EncodeBytes = (deckContents) => {
    if (!deckContents || !deckContents.heroes || !deckContents.cards) {
      return false;
    }

    deckContents.heroes.sort(SortCardsById);
    deckContents.cards.sort(SortCardsById);

    const countHeroes = deckContents.heroes.length;
    const allCards = deckContents.heroes.concat(deckContents.cards);

    ContinuousVars["&bytes"] = [];
    // Valve: our version and hero count
    const version =
      (s_nCurrentVersion << 4) | ExtractNBitsWithCarry(countHeroes, 3);
    if (!AddByte("&bytes", version)) {
      return false;
    }

    // Valve: the checksum which will be updated at the end
    const nDummyChecksum = 0;
    const nChecksumByte = ContinuousVars["&bytes"].length;
    if (!AddByte("&bytes", nDummyChecksum)) {
      return false;
    }

    // Valve: write the name size
    let nameLen = 0;
    let name = "";
    if (deckContents.name) {

      name = strip_tags(deckContents.name);
      let trimLen = name.length;
      while (trimLen > 63) {
        let amountToTrim = Math.floor((trimLen - 63) / 4);
        amountToTrim = amountToTrim > 1 ? amountToTrim : 1;
        name = name.substring(0, name.length - amountToTrim);
        trimLen = name.length;
      }
      nameLen = name.length;
    }

    if (!AddByte("&bytes", nameLen)) {
      return false;
    }
    if (!AddRemainingNumberToBuffer(countHeroes, 3, "&bytes")) {
      return false;
    }

    let prevCardId = 0;
    // heroes
    for (let unCurrHero = 0; unCurrHero < countHeroes; unCurrHero++) {
      let card = allCards[unCurrHero];
      if (!card.turn) {
        return false;
      }
      if (!AddCardToBuffer(card.turn, card.id - prevCardId, "&bytes")) {
        return false;
      }
      prevCardId = card.id;
    }

    // Valve: reset our card offset
    prevCardId = 0;
    // Valve: now all of the cards
    for (let nCurrCard = countHeroes; nCurrCard < allCards.length; nCurrCard++) {
      let card = allCards[nCurrCard];

      if (card.count === 0) {
        return false;
      }
      if (card.id <= 0) {
        return false;
      }

      // Valve: record this set of cards, and advance
      if (!AddCardToBuffer(card.count, card.id - prevCardId, "&bytes")) {
        return false;
      }
      prevCardId = card.id;
    }

    // Valve: save off the pre string bytes for the checksum
    const preStringByteCount = ContinuousVars["&bytes"].length;

    // Valve: write the string
    const nameBytes = [];
    for(let i = 0, length = name.length; i < length; i++) {
        const code = name.charCodeAt(i);
        nameBytes.push(code);
    }
    nameBytes.forEach(nameByte => {
        if(!AddByte( "&bytes", nameByte )){
            return false;
        }
    })

    const unFullChecksum = ComputeChecksum( "&bytes", preStringByteCount - knHeaderSize );
    const unSmallChecksum = ( unFullChecksum & 0x0FF );

    ContinuousVars["&bytes"][nChecksumByte] = unSmallChecksum;
    
    return ContinuousVars["&bytes"];
  };

  const EncodeBytesToString = (bytes) => {
    //if we have an empty buffer, just return
    if ( bytes.length === 0 ){
        return false;
    }

    const packed = pack.apply(null, ["C*"].concat(bytes));
    const encoded = btoa(packed);

    const deck_string = sm_rgchEncodedPrefix + encoded;

    let fixedString = deck_string;    
    fixedString = fixedString.replace(/\//g, "-");
    fixedString = fixedString.replace(/=/g, "_");
    
    return fixedString;
  };

  const SortCardsById = (a, b) => {
    return a.id <= b.id ? -1 : 1;
  };

  const ExtractNBitsWithCarry = (value, numBits) => {
    const unLimitBit = 1 << numBits;
    let unResult = value & (unLimitBit - 1);
    if (value >= unLimitBit) {
      unResult |= unLimitBit;
    }

    return unResult;
  };

  // &$bytes
  const AddByte = ($bytes, byte) => {
    if (byte > 255) {
      return false;
    }
    ContinuousVars[$bytes].push(byte);
    return true;
  };

  // &$bytes
  const AddRemainingNumberToBuffer = (
    unValue,
    unAlreadyWrittenBits,
    $bytes
  ) => {
    unValue >>= unAlreadyWrittenBits;

    let unNumBytes = 0;
    while (unValue > 0) {
      let unNextByte = ExtractNBitsWithCarry(unValue, 7);
      unValue >>= 7;
      if (!AddByte($bytes, unNextByte)) {
        return false;
      }
      unNumBytes++;
    }

    return true;
  };

  // &$bytes
  const AddCardToBuffer = (unCount, unValue, $bytes) => {
    if (unCount === 0) {
      return false;
    }

    const countBytesStart = ContinuousVars[$bytes].length;

    // Valve: determine our count. We can only store 2 bits, and we know the value is at least one, so we can encode values 1-5.
    // Valve: However, we set both bits to indicate an extended count encoding
    const knFirstByteMaxCount = 0x03;
    const bExtendedCount = unCount - 1 >= knFirstByteMaxCount;

    // Valve: determine our first byte, which contains our count, a continue flag, and the first few bits of our value
    const unFirstByteCount = bExtendedCount ? knFirstByteMaxCount : unCount - 1;
    let unFirstByte = unFirstByteCount << 6;
    unFirstByte |= ExtractNBitsWithCarry(unValue, 5);

    if (!AddByte($bytes, unFirstByte)) {
      return false;
    }

    // Valve: now continue writing out the rest of the number with a carry flag
    if (!AddRemainingNumberToBuffer(unValue, 5, $bytes)) {
      return false;
    }

    // Valve: now if we overflowed on the count, encode the remaining count
    if (bExtendedCount) {
      if (!AddRemainingNumberToBuffer(unCount, 0, $bytes)) {
        return false;
      }
    }

    const countBytesEnd = ContinuousVars[$bytes].length;
    if (countBytesEnd - countBytesStart > 11) {
      // Valve: something went horribly wrong
      return false;
    }

    return true;
  };

  // &$bytes
  const ComputeChecksum = ($bytes, unNumBytes) => {
    let unChecksum = 0;
    for ( let unAddCheck = knHeaderSize; unAddCheck < unNumBytes + knHeaderSize; unAddCheck++ )
    {
        const byte = ContinuousVars[$bytes][unAddCheck];
        unChecksum += byte;
    }

    return unChecksum;
  };

  const strip_tags = (HtmlString) => {
    return HtmlString.replace(/(<([^>]+)>)/gi, "");
  };

  return { EncodeDeck };
})();

window.CArtifactDeckEncoder = CArtifactDeckEncoder;