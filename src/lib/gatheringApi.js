// src/lib/gatheringApi.js
import { supabase } from './supabase';

/**
 * 生成隨機短 ID
 */
function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * 建立新的聚會
 * @param {Object} gatheringData - 聚會資料
 * @param {string} gatheringData.intent - 意圖（接送、面交、吃喝玩樂、就找個點）
 * @param {string} gatheringData.timeMode - 時間模式（instant 或 date_selection）
 * @param {string} gatheringData.creatorName - 建立者名稱
 * @param {string} gatheringData.creatorLineId - 建立者 LINE ID（可選）
 * @param {Object} creatorData - 建立者的參與資料
 * @param {string} creatorData.location - 出發地點
 * @param {number} creatorData.latitude - 經度（可選）
 * @param {number} creatorData.longitude - 緯度（可選）
 * @param {string} creatorData.transportMode - 交通方式
 * @param {Array<string>} creatorData.availableDates - 可用日期陣列（僅 date_selection 模式）
 * @returns {Promise<{success: boolean, shortId?: string, error?: string}>}
 */
export async function createGathering(gatheringData, creatorData) {
  try {
    const shortId = generateShortId();

    // 1. 建立聚會
    const { data: gathering, error: gatheringError } = await supabase
      .from('gatherings')
      .insert({
        short_id: shortId,
        intent: gatheringData.intent,
        time_mode: gatheringData.timeMode,
        creator_name: gatheringData.creatorName,
        creator_line_id: gatheringData.creatorLineId || null,
      })
      .select()
      .single();

    if (gatheringError) throw gatheringError;

    // 2. 建立建立者的參與記錄
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert({
        gathering_id: gathering.id,
        name: gatheringData.creatorName,
        line_id: gatheringData.creatorLineId || null,
        location: creatorData.location,
        latitude: creatorData.latitude || null,
        longitude: creatorData.longitude || null,
        transport_mode: creatorData.transportMode,
        is_creator: true,
      })
      .select()
      .single();

    if (participantError) throw participantError;

    // 3. 如果是日期投票模式，插入可用日期
    if (gatheringData.timeMode === 'date_selection' && creatorData.availableDates?.length > 0) {
      const datesToInsert = creatorData.availableDates.map(date => ({
        participant_id: participant.id,
        date_value: date,
      }));

      const { error: datesError } = await supabase
        .from('available_dates')
        .insert(datesToInsert);

      if (datesError) throw datesError;
    }

    return { success: true, shortId };
  } catch (error) {
    console.error('建立聚會失敗:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 根據短 ID 取得聚會資料
 * @param {string} shortId - 短 ID
 * @returns {Promise<{success: boolean, gathering?: Object, error?: string}>}
 */
export async function getGathering(shortId) {
  try {
    const { data: gathering, error: gatheringError } = await supabase
      .from('gatherings')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (gatheringError) throw gatheringError;

    // 取得所有參與者
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .eq('gathering_id', gathering.id);

    if (participantsError) throw participantsError;

    // 如果是日期投票模式，取得每個參與者的可用日期
    if (gathering.time_mode === 'date_selection') {
      for (const participant of participants) {
        const { data: dates } = await supabase
          .from('available_dates')
          .select('date_value')
          .eq('participant_id', participant.id);

        participant.available_dates = dates?.map(d => d.date_value) || [];
      }
    }

    return {
      success: true,
      gathering: {
        ...gathering,
        participants,
      },
    };
  } catch (error) {
    console.error('取得聚會失敗:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 加入聚會（新增參與者）
 * @param {string} shortId - 聚會短 ID
 * @param {Object} participantData - 參與者資料
 * @param {string} participantData.name - 參與者名稱
 * @param {string} participantData.lineId - LINE ID（可選）
 * @param {string} participantData.location - 出發地點
 * @param {number} participantData.latitude - 經度（可選）
 * @param {number} participantData.longitude - 緯度（可選）
 * @param {string} participantData.transportMode - 交通方式
 * @param {Array<string>} participantData.availableDates - 可用日期陣列（僅 date_selection 模式）
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function joinGathering(shortId, participantData) {
  try {
    // 1. 先取得聚會資料
    const { data: gathering, error: gatheringError } = await supabase
      .from('gatherings')
      .select('id, time_mode')
      .eq('short_id', shortId)
      .single();

    if (gatheringError) throw gatheringError;

    // 2. 新增參與者
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert({
        gathering_id: gathering.id,
        name: participantData.name,
        line_id: participantData.lineId || null,
        location: participantData.location,
        latitude: participantData.latitude || null,
        longitude: participantData.longitude || null,
        transport_mode: participantData.transportMode,
        is_creator: false,
      })
      .select()
      .single();

    if (participantError) throw participantError;

    // 3. 如果是日期投票模式，插入可用日期
    if (gathering.time_mode === 'date_selection' && participantData.availableDates?.length > 0) {
      const datesToInsert = participantData.availableDates.map(date => ({
        participant_id: participant.id,
        date_value: date,
      }));

      const { error: datesError } = await supabase
        .from('available_dates')
        .insert(datesToInsert);

      if (datesError) throw datesError;
    }

    return { success: true };
  } catch (error) {
    console.error('加入聚會失敗:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 取得日期投票結果（找出所有人都可以的日期）
 * @param {string} shortId - 聚會短 ID
 * @returns {Promise<{success: boolean, commonDates?: Array<string>, error?: string}>}
 */
export async function getCommonDates(shortId) {
  try {
    const { data: gathering, error: gatheringError } = await supabase
      .from('gatherings')
      .select('id')
      .eq('short_id', shortId)
      .single();

    if (gatheringError) throw gatheringError;

    // 取得所有參與者
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id')
      .eq('gathering_id', gathering.id);

    if (participantsError) throw participantsError;

    const participantCount = participants.length;

    // 查詢哪些日期被所有參與者都選了
    const { data: commonDates, error: datesError } = await supabase
      .from('available_dates')
      .select('date_value')
      .in('participant_id', participants.map(p => p.id))
      .then(result => {
        if (result.error) throw result.error;

        // 計算每個日期被選擇的次數
        const dateCounts = {};
        result.data.forEach(({ date_value }) => {
          dateCounts[date_value] = (dateCounts[date_value] || 0) + 1;
        });

        // 找出被所有人都選擇的日期
        const common = Object.entries(dateCounts)
          .filter(([_, count]) => count === participantCount)
          .map(([date]) => date)
          .sort();

        return { data: common, error: null };
      });

    if (datesError) throw datesError;

    return { success: true, commonDates };
  } catch (error) {
    console.error('取得共同日期失敗:', error);
    return { success: false, error: error.message };
  }
}
