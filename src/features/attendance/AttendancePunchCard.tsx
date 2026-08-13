import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useGetTodayStatusQuery,
  useCheckInMutation,
  useCheckOutMutation,
} from "./attendanceApi";
import { openCameraModal, closeCameraModal } from "./attendanceSlice";
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogIn,
  LogOut,
  X,
  Upload,
  Sparkles,
} from "lucide-react";

export const AttendancePunchCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCameraModalOpen, activeAction } = useAppSelector(
    (state) => state.attendance
  );

  // Today's status query
  const {
    data: todayStatusResponse,
    isLoading: isStatusLoading,
    isError: isStatusError,
    refetch: refetchStatus,
  } = useGetTodayStatusQuery();

  const todayStatus = todayStatusResponse?.data;

  // Mutations
  const [checkIn, checkInState] = useCheckInMutation();
  const [checkOut, checkOutState] = useCheckOutMutation();

  // Local component state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fetch location when camera modal opens
  useEffect(() => {
    if (isCameraModalOpen) {
      handleFetchLocation();
    } else {
      resetForm();
    }
  }, [isCameraModalOpen]);

  const resetForm = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCoords({});
    setLocationError(null);
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationError(`Location error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleTriggerAction = (action: "check-in" | "check-out") => {
    setSubmissionFeedback(null);
    dispatch(openCameraModal(action));
  };

  const handleSubmitPunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setSubmissionFeedback({
        type: "error",
        message: "Please select or take a photo before submitting.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (coords.latitude !== undefined) {
      formData.append("latitude", String(coords.latitude));
    }
    if (coords.longitude !== undefined) {
      formData.append("longitude", String(coords.longitude));
    }
    formData.append("device_info", navigator.userAgent);

    try {
      if (activeAction === "check-in") {
        const res = await checkIn(formData).unwrap();
        setSubmissionFeedback({
          type: "success",
          message: res.message || "Successfully checked in with face verification!",
        });
      } else {
        const res = await checkOut(formData).unwrap();
        setSubmissionFeedback({
          type: "success",
          message: res.message || "Successfully checked out!",
        });
      }
      dispatch(closeCameraModal());
      refetchStatus();
    } catch (err: any) {
      const errMsg =
        err?.data?.message ||
        err?.message ||
        `Failed to perform ${activeAction}. Please try again.`;
      setSubmissionFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

  const isSubmitting = checkInState.isLoading || checkOutState.isLoading;

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/30 rounded-xl border border-indigo-400/30 text-indigo-300">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
              Face Attendance Punch Card
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              FastAPI RTK Query Powered • Geolocation & Biometric Verification
            </p>
          </div>
        </div>
        <button
          onClick={() => refetchStatus()}
          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
        >
          Refresh Status
        </button>
      </div>

      {/* Submission Feedback Alert */}
      {submissionFeedback && (
        <div
          className={`mb-4 p-3.5 rounded-xl border text-sm flex items-start gap-3 ${
            submissionFeedback.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/15 border-rose-500/30 text-rose-300"
          }`}
        >
          {submissionFeedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-medium">{submissionFeedback.message}</p>
          </div>
          <button
            onClick={() => setSubmissionFeedback(null)}
            className="text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Today Status Display */}
      {isStatusLoading ? (
        <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm">Fetching today&apos;s punch status...</p>
        </div>
      ) : isStatusError ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-4">
          <p className="font-medium">Could not connect to FastAPI server.</p>
          <p className="text-xs text-amber-400/80 mt-1">
            Ensure backend server is active at /api/v1
          </p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Today&apos;s Status
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                todayStatus?.checked_in && !todayStatus?.checked_out
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : todayStatus?.checked_out
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-slate-700/50 text-slate-300 border border-slate-600"
              }`}
            >
              {todayStatus?.checked_in && !todayStatus?.checked_out
                ? "Checked In"
                : todayStatus?.checked_out
                ? "Checked Out"
                : "Not Checked In"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm pt-1">
            <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-xs text-slate-400 block mb-0.5">Check In Time</span>
              <span className="font-medium text-slate-200">
                {todayStatus?.check_in_time
                  ? new Date(todayStatus.check_in_time).toLocaleTimeString()
                  : "—"}
              </span>
            </div>
            <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-xs text-slate-400 block mb-0.5">Check Out Time</span>
              <span className="font-medium text-slate-200">
                {todayStatus?.check_out_time
                  ? new Date(todayStatus.check_out_time).toLocaleTimeString()
                  : "—"}
              </span>
            </div>
          </div>

          {todayStatus?.working_hours !== undefined && (
            <div className="text-xs text-slate-400 pt-1 flex items-center justify-between border-t border-white/5">
              <span>Working Duration:</span>
              <span className="font-semibold text-indigo-300">
                {todayStatus.working_hours.toFixed(2)} hours
              </span>
            </div>
          )}

          {todayStatus?.message && (
            <p className="text-xs text-slate-400 italic">
              &quot;{todayStatus.message}&quot;
            </p>
          )}
        </div>
      )}

      {/* Action Trigger Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleTriggerAction("check-in")}
          disabled={isSubmitting || (todayStatus?.checked_in && !todayStatus?.checked_out)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/40 text-white transition active:scale-[0.98]"
        >
          <LogIn className="w-4 h-4" />
          Check In (Face)
        </button>

        <button
          onClick={() => handleTriggerAction("check-out")}
          disabled={isSubmitting || !todayStatus?.checked_in || todayStatus?.checked_out}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-950/40 text-white transition active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          Check Out (Face)
        </button>
      </div>

      {/* Camera Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400" />
                {activeAction === "check-in" ? "Check In Photo" : "Check Out Photo"}
              </h4>
              <button
                onClick={() => dispatch(closeCameraModal())}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPunch} className="space-y-4">
              {/* Photo Upload / Capture Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Selfie / Face Capture <span className="text-rose-400">*</span>
                </label>

                {previewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-indigo-500/40 bg-black/40 h-48 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Face capture preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-indigo-400/60 bg-white/5 rounded-xl h-48 flex flex-col items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Upload className="w-8 h-8 text-indigo-400" />
                    <span className="text-xs text-slate-300 font-medium">
                      Click to upload photo or take selfie
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Supports JPG, PNG, WEBP
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Geolocation Section */}
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    GPS Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    disabled={isLocating}
                    className="text-indigo-400 hover:text-indigo-300 underline font-medium text-[11px]"
                  >
                    {isLocating ? "Locating..." : "Refetch GPS"}
                  </button>
                </div>

                {isLocating ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Acquiring device location...
                  </div>
                ) : coords.latitude !== undefined ? (
                  <div className="text-xs font-mono text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                    Lat: {coords.latitude.toFixed(6)}, Long: {coords.longitude?.toFixed(6)}
                  </div>
                ) : locationError ? (
                  <p className="text-xs text-rose-400">{locationError}</p>
                ) : (
                  <p className="text-xs text-slate-400">Location not captured.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => dispatch(closeCameraModal())}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-900/50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit {activeAction === "check-in" ? "Check In" : "Check Out"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePunchCard;
