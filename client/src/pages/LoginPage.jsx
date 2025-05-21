import {
  useCheckEmail,
  useLogin,
  useResendOtp,
  useUpdatePassword,
  useVerifyRegisteredUser,
} from "@/api/AuthApi";
import { useUpdateUser } from "@/api/MyUserApi";
import LoginForm from "@/forms/authForms/LoginForm";
import OTPVerificationForm from "@/forms/authForms/OtpVerificationForm";
import UpdatePasswordForm from "@/forms/authForms/UpdatePasswordForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUser } from "@/redux/user/userSlice";
import { fetchCart, mergeLocalCart } from "@/redux/cart/cartSlice";
import StoreBranchModal from "@/components/StoreSelection";
import { useGetBranches } from "@/api/HomeApi";
import { setBranch } from "@/redux/branch/branchSlice";
import { SelectBranchModal } from "@/components/SelectBranchModal";
import { setAccessToken } from "@/redux/auth/authSlice";
import ConfirmEmailForm from "@/forms/authForms/ConfirmEmail";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const LoginPage = () => {
  const { login, isLoggingIn } = useLogin();
  console.log(isLoggingIn);
  const dispatch = useDispatch();

  // API Hooks
  const { verifyRegisteredEmail, isVerifying } = useVerifyRegisteredUser();
  const { checkEmail, isChecking } = useCheckEmail();
  const { updatePassword, isUpdatingPassword } = useUpdatePassword();
  const { resendOtp } = useResendOtp();
  const { branches: apiBranches, isLoadingBranches } = useGetBranches();
  const axiosPrivate = useAxiosPrivate();

  // States
  const [resetPassword, setResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showStoreBranchModal, setShowStoreBranchModal] = useState(false); // State to control StoreBranchModal visibility
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]); // Local state to store branches
  const { selectedBranch } = useSelector((state) => state.branch);

  useEffect(() => {
    // Update local state with API branches once they are loaded
    if (!isLoadingBranches && apiBranches.length > 0) {
      setBranches(apiBranches);
      dispatch(setBranch(apiBranches[0]));
    }
  }, [apiBranches, isLoadingBranches]);

  // OnSave Functions
  const handleResetPasswordSave = async (data) => {
    const { email } = data;
    try {
      await checkEmail(data).then(() => {
        setEmail(email);
        setResetPassword(false);
        setShowVerificationForm(true);
      });
    } catch (error) {
      console.log("Error");
    }
  };

  const handleVerificationSave = async (data) => {
    const { otp } = data;
    console.log(otp);
    const verifyData = {
      email,
      otp,
    };
    try {
      await verifyRegisteredEmail(verifyData).then(() => {
        setShowVerificationForm(false);
        setShowUpdateForm(true);
      });
    } catch (error) {
      console.log("Error");
    }
  };

  const handleLoginSave = async (data) => {
    try {
      const { user, accessToken } = await login(data);
      dispatch(saveUser(user));
      dispatch(setAccessToken(accessToken));
      try {
        const response = await dispatch(
          mergeLocalCart({ axiosPrivate })
        ).unwrap();
        console.log("Merged cart response:", response);
      } catch (error) {
        console.error("Error merging local cart:", error.message);
      }
      setShowStoreBranchModal(true);
      if (selectedBranch) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error.message);
    }
  };

  const handleUpdateSave = async (data) => {
    const password = data.password;
    const updateData = {
      email,
      password,
    };
    console.log(updateData);
    try {
      await updatePassword(updateData).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log("Error");
    }
  };

  const handleBranchSave = (branch) => {
    dispatch(setBranch(branch));
    setShowStoreBranchModal(false);
    navigate("/");
  };

  //modal function
  const handleClose = () => {
    setShowStoreBranchModal(false);
  };
  return (
    <div
      className={`h-screen w-full flex items-center justify-center md:bg-white md:p-20 bg-cover bg-center lg:bg-gradient-to-b lg:from-white lg:to-gray-300`}
    >
      {resetPassword ? (
        <ConfirmEmailForm
          onButtonClick={() => setResetPassword(false)}
          isLoading={isChecking}
          onSave={handleResetPasswordSave}
        />
      ) : showVerificationForm ? (
        <OTPVerificationForm
          onSave={handleVerificationSave}
          isLoading={isVerifying}
          onXButtonClick={() => setShowVerificationForm(false)}
          onButtonClick={null}
          onResendOtpClick={() => resendOtp({ phoneNumber })}
        />
      ) : showUpdateForm ? (
        <UpdatePasswordForm
          onSave={handleUpdateSave}
          isLoading={isUpdatingPassword}
          onButtonClick={() => setShowUpdateForm(false)}
        />
      ) : (
        <LoginForm
          onSave={handleLoginSave}
          isLoading={isLoggingIn}
          onButtonClick={() => setResetPassword(true)}
        />
      )}
      {showStoreBranchModal && !selectedBranch && (
        <SelectBranchModal onSave={handleBranchSave} />
      )}
    </div>
  );
};

export default LoginPage;
